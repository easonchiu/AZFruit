var cache = require('memory-cache')
var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/clientJwtKey')
var WX = require('../conf/wx')
var axios = require('axios')
var UserModel = require('../models/user')
var VerificationModel = require('../models/verification')
var SkuModel = require('../models/sku')
var OrderModel = require('../models/order')
var CouponModel = require('../models/coupon')
var sha1 = require('sha1')
var WXPay = require('../middlewares/wx')

class Control {
	
	// 微信授权
	static async authCallback(ctx, next) {
		try {
			let { code, state, redirect, token } = ctx.query
			
			if (!token || !redirect) {
				return ctx.body = '参数错误'
			}
			
			// 解析jwt
			const userInfo = jwt.verify(token, jwtKey)

			// 请求微信授权接口
			const res = await axios.request({
				method: 'get',
				url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WX.appID}&secret=${WX.appsecret}&code=${code}&grant_type=authorization_code`
			})
			
			// 如果有错误，报错
			if (res.data.errcode) {
				return ctx.body = '授权异常'
			}
			// 成功，将openid更新到用户表，然后302返回
			else {
				await UserModel.update({
					_id: userInfo.uid
				}, {
					openId: res.data.openid
				})
				ctx.redirect(decodeURIComponent(redirect))
			}
		}
		catch (e) {
			return ctx.body = '授权异常'
		}
	}
	
	// 微信支付回调
	static async unifiedorderCallback(ctx, next) {
		try {
			const wxres = ctx.request.weixin

			let doc = await OrderModel.findOne({
				orderNo: wxres.out_trade_no
			})
			
			// 找到这个订单
			if (!doc) {
				return ctx.reply('未找到相关订单')
			}
			// 订单状态不正常
			else if (doc.status != 1) {
				return ctx.reply('订单状态不正常')
			}

			// 更新原表中的订单
			await OrderModel.update({
				orderNo: wxres.out_trade_no
			}, {
				$set: {
					// 查找相关的订单将其改成支付完成状态
					status: 11,
					// 把微信订单号存进来
					wxOrderNo: wxres.transaction_id,
					// 把支付时间存下来
					paymentTime: new Date()
				}
			})

			// 如果有优惠券，把这张券改为已使用
			if (doc.coupon) {
				await UserModel.usedCoupon(doc.uid, doc.coupon.id)
				
				// 在核销表中存入信息
				const find = await VerificationModel.findOne({
					cid: doc.coupon.id
				})
				
				if (!find) {
					await new VerificationModel({
						cid: doc.coupon.id,
						originId: doc.coupon.originId,
						userId: doc.uid,
						orderNo: wxres.out_trade_no,
						couponName: doc.coupon.name,
						couponBatch: doc.coupon.batch,
						couponCondition: doc.coupon.condition,
						couponWorth: doc.coupon.worth
					}).create()

					// 在券表中已使用计数器+1
					await CouponModel.countUsed(doc.coupon.originId)
				}

				// 在券表中已使用计数器+1
				if (created) {
					await CouponModel.countUsed(doc.coupon.originId)
				}
			}

			// 遍历用户购买的商品，在库存表中减掉他们，并在销量中加上
			if (doc.list && doc.list.length) {
				await SkuModel.sellStock(doc.list)
			}

			return ctx.reply()
		}
		catch (e) {
			console.log(e)
			return ctx.error()
		}
	}
	
	// 获取ticket
	static async getTicket(ctx, next) {
		try {
			const TICKET = cache.get('TICKET')
			const {url} = ctx.request.body

			const data = {
				appId: WX.appID
			}
			
			// 如果缓存中的TICKET过期，重新获取
			if (!TICKET) {
				const ticket = await Control.asyncGetTicket()

				// 缓存3000秒，有效期为7200秒
				cache.put('TICKET', ticket, 1000 * 3000)
				data.ticket = ticket
			}
			else {
				data.ticket = TICKET
				data.memory = true
			}

			// 随机字符串
			const random = Math.random().toString(32)
			data.nonceStr = random

			// 时间错
			const timestamp = Math.floor(Date.now() / 1000)
			data.timestamp = timestamp

			// 签名算法
			const signature = sha1(`jsapi_ticket=${data.ticket}&noncestr=${data.nonceStr}&timestamp=${data.timestamp}&url=${url}`)
			data.signature = signature

			return ctx.success({
				data: data
			})
		}
		catch (e) {
			return ctx.error()
		}
	}

	static asyncGetTicket() {
		return new Promise(async (resolve, reject) => {
			const atres = await axios.request({
				method: 'post',
				url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WX.appID}&secret=${WX.appsecret}`
			})
			
			// 拿到access_token
			if (atres.data && atres.data.access_token) {
				
				// 拿到之后调用获取ticket接口
				const ticketres = await axios.request({
					method: 'post',
					url: `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${atres.data.access_token}&type=jsapi`
				})

				// 拿到ticket
				if (ticketres.data && ticketres.data.ticket) {
					resolve(ticketres.data.ticket)
				}
				else {
					reject()
				}
			}
			else {
				reject()
			}
		})
	}

	// 查询订单
	static async unifiedorderQuery(ctx, next) {
		try {

			let { orderNo } = ctx.request.body

			let wxres = await WXPay.orderQuery({
				out_trade_no: orderNo
			})

			// 如果支付成功
			if (wxres.trade_state == 'SUCCESS' && wxres.cash_fee) {
				// 查询订单
				const doc = await OrderModel.findOne({
					orderNo
				})

				// 查看订单状态，如果是待支付，说明是有问题的，因为它已经付了，可能是微信没通知到，手动操作掉它
				if (doc.status == 1) {

					// 更新原表中的订单
					await OrderModel.update({
						orderNo: orderNo
					}, {
						$set: {
							// 查找相关的订单将其改成支付完成状态
							status: 11,
							// 把微信id存进来
							wxOrderNo: wxres.transaction_id,
							// 把支付时间存下来
							paymentTime: new Date()
						}
					})

					// 如果有优惠券，把这张券改为已使用
					if (doc.coupon) {
						await UserModel.usedCoupon(doc.uid, doc.coupon.id)

						// 在核销表中存入信息
						const find = await VerificationModel.findOne({
							cid: doc.coupon.id
						})
						
						if (!find) {
							await new VerificationModel({
								cid: doc.coupon.id,
								originId: doc.coupon.originId,
								userId: doc.uid,
								orderNo: wxres.out_trade_no,
								couponName: doc.coupon.name,
								couponBatch: doc.coupon.batch,
								couponCondition: doc.coupon.condition,
								couponWorth: doc.coupon.worth
							}).create()

							// 在券表中已使用计数器+1
							await CouponModel.countUsed(doc.coupon.originId)
						}
					}

					// 遍历用户购买的商品，在库存表中减掉他们，并在销量中加上
					if (doc.list && doc.list.length) {
						await SkuModel.sellStock(doc.list)
					}

				}
				return ctx.success({
					data: {status: 11}
				})
			}
			return ctx.success({
				data: {status: 1}
			})
		}
		catch (e) {
			console.log(e)
			return ctx.success({
				data: {status: 1}
			})
		}
	}

}

module.exports = Control