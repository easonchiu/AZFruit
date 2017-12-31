var OrderModel = require('../models/order')
var ShoppingcartCon = require('./f.shoppingcart')
var SkuModel = require('../models/sku')
var UserModel = require('../models/user')

var cache = require('memory-cache')
var axios = require('axios')
var WX = require('../conf/wx')
var dateFormat = require('dateformat')
var md5 = require('md5')

class Control {

	static async _fetchList(ctx, next, uid) {
		try {
			let { skip = 0, limit = 10, type = 1 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			let count = 0

			console.log(12312)

			const search = [{
				$sort: {
					createTime: -1,
				}
			}, {
				$project: {
					_id: 0,
					__v: 0
				}
			}, {
				$skip: skip
			}, {
				$limit: limit
			}]
			
			// 如果特指到某一用户，只查他的
			if (uid) {
				const match = {
					$match: {
						uid
					}
				}

				// 进行中的订单
				if (type == 1) {
					match.$match.status = 1
					match.$match.paymentTimeout = {
						'$gt': new Date()
					}
				}
				// 已完成的订单
				else if (type == 2) {
					// 除了待支付和已关闭的订单
					match.$match.status = {
						$all: [11, 21, 31, 41]
					}
				}
				search.unshift(match)
			}
			else {
				count = await OrderModel.count({})
			}

			const list = await OrderModel.aggregate(search) || []

			return ctx.success({
				data: {
					list,
					count,
					skip,
					limit,
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 获取进行中的订单数量
	static async fetchAmount(ctx, next) {
		try {
			const {uid} = ctx.state.jwt

			// 查询相关的订单
			const res = await OrderModel.find({
				uid: uid,
				status: 1,
				paymentTimeout: {
					'$gt': new Date()
				}
			})

			return ctx.success({
				data: {
					amount: res ? res.length : 0
				}
			})
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 用户获取订单列表
	static async fetchList(ctx, next) {
		const {uid} = ctx.state.jwt
		return await Control._fetchList(ctx, next, uid)
	}

	// 用户取消订单
	static async cancelOrder(ctx, next) {
		try {
			const {uid} = ctx.state.jwt

			const id = ctx.params.id

			// 查找相关且未支付的订单
			const doc = await OrderModel.findOne({
				uid,
				orderNo: id,
				status: 1
			})

			// 找到订单
			if (doc) {
				// 要将订单状态改为交易关闭，只有待支付的可以
				await OrderModel.update({
					uid,
					orderNo: id
				}, {
					$set: {
						status: 90
					}
				})

				return ctx.success()
			}
			// 未找到订单
			else {
				if (doc.status && doc.status !== 1) {
					return ctx.error({
						msg: '订单无法关闭'
					})
				} else {
					return ctx.error({
						msg: '该订单不存在'
					})
				}
			}
		}
		catch (e) {
			return ctx.error()
		}
	}
	
	// 用户获取订单详情
	static async fetchDetail(ctx, next) {
		try {
			const {uid} = ctx.state.jwt

			const id = ctx.params.id

			const res = await OrderModel.findOne({
				uid,
				orderNo: id
			}, {
				__v: 0,
				_id: 0
			})

			if (res) {
				// 待支付的订单
				if (res.status === 1) {
					const couponId = ctx.query.couponId

					// 如果是待支付的话，计算剩余支付时间
					const now = new Date()
					const timeout = Math.round((res.paymentTimeout.getTime() - now.getTime()) / 1000)

					// 如果还在支付时间内
					if (timeout > 0) {
						
						// 查找可用的优惠券
						const coupons = await UserModel.findOne({
							_id: uid
						}, 'couponList')

						// 算出可用的coupon
						let resCoupons = []
						let choosedCoupon
						if (coupons && coupons.couponList) {
							resCoupons = coupons.couponList.filter(c => {
								const now = new Date()
								if (c.condition < res.totalPrice && c.expiredTime > now) {
									return true
								}
								return false
							})

							// 如果有选择coupon，找到匹配中的
							resCoupons.forEach(c => {
								if (couponId && couponId == c.id) {
									choosedCoupon = c
								}
							})
						}
						
						let usedCoupon
						// 如果有优惠券，排序，并拿价值最高的作为默认使用券
						if (resCoupons.length) {
							resCoupons.sort((a, b) => a.worth > b.worth ? -1 : 1)
							usedCoupon = choosedCoupon ? choosedCoupon : resCoupons[0]
						}
						
						// 计算优惠券的价值
						let couponWorth = 0
						if (usedCoupon) {
							couponWorth = usedCoupon.worth
						}
						let needPayment = res._doc.needPayment - couponWorth
						if (needPayment < 1) {
							needPayment = 1
						}

						// 在返回参数中添加值
						res._doc.couponList = resCoupons
						res._doc.paymentTimeoutSec = timeout
						res._doc.needPayment = needPayment
						res._doc.usedCoupon = usedCoupon

						return ctx.success({
							data: res._doc
						})
					}
					// 如果已经过了支付时间
					else {
						return ctx.error({
							msg: '订单超时未支付，请重新下单',
							code: 90
						})
					}
				}
				// 如果订单状态不为待支付，直接将查询结果返回
				else {
					return ctx.success({
						data: res
					})
				}
			} else {
				return ctx.error({
					msg: '该订单不存在'
				})
			}
		} catch(e) {
			return ctx.error()
		}
	}

	// 用户下单
	static async create(ctx, next) {
		try {
			if (cache.get('create_order_lock')) {
				return ctx.error({
					msg: '系统繁忙，请稍后再试'
				})
			}

			// 上锁
			cache.put('create_order_lock', true)

			const body = ctx.request.body

			const {uid} = ctx.state.jwt
			
			// 如果没有uid，一般都会有
			if (!uid) {
				return ctx.error({
					msg: '身份信息错误'
				})
			}

			// 获取用户openid信息
			const userInfo = await UserModel.findOne({
				_id: uid
			}, 'openId')
			
			if (!userInfo.openId) {
				return ctx.error({
					msg: 'openid错误',
					code: 4001
				})
			}

			// 获取购物车内的信息
			const info = await ShoppingcartCon.getShoppingcartInfo(uid, body.addressid)

			if (info.list && info.list.length) {
				// 如果库存不够，提示
				for (let i = 0; i < info.list.length; i++) {
					const data = info.list[i]

					if (data.stock < data.amount) {
						return ctx.error({
							msg: '购物车中的' + data.name + '库存不够'
						})
					}
				}
				
				// 库存数量都够的情况下，占据库存
				await SkuModel.occupyStock(info.list)
			}
			else {
				return ctx.error({
					msg: '购物车中没有可购买的产品'
				})
			}

			// 创建个订单号，订单号为当前系统时间的秒级，再加计数器
			const now = new Date()
			const yy = ('' + now.getFullYear()).substr(-2)
			const mm = ('0000' + (now.getMonth() + 1)).substr(-2)
			const dd = ('0000' + now.getDate()).substr(-2)
			const h = ('0000' + now.getHours()).substr(-2)
			const m = ('0000' + now.getMinutes()).substr(-2)
			const s = ('0000' + now.getSeconds()).substr(-2)
			const count = cache.get('orderCount') ? +cache.get('orderCount') + 1 : '001'
			const orderNo = yy + mm + dd + h + m + s + count
			
			// 缓存下一个计数器
			const nextCount = count > 999 ? '001' : count
			cache.put('orderCount', nextCount)
			
			// 订单需要30分钟内支付
			const after30m = new Date(now.getTime() + 1000 * 60 * 30)

			// 生成订单（注意生成的订单中不包含优惠券）
			await new OrderModel({
				orderNo,
				wxOrderNo: '',
				uid: uid,
				openId: userInfo.openId,
				city: info.address.city,
				cityCode: info.address.cityCode,
				zipCode: info.address.zipCode,
				mobile: info.address.mobile,
				name: info.address.name,
				area: info.address.area,
				address: info.address.address,
				lat: info.address.lat,
				lon: info.address.lon,
				distance: info.address.distance,
				totalWeight: info.totalWeight,
				totalPrice: info.totalPrice,
				postage: info.postagePrice,
				needPayment: info.totalPrice + info.postagePrice,
				status: 1,
				goodsList: info.list,
				paymentTimeout: after30m
			}).create()

			// 清空购物车
			await UserModel.update({
				_id: uid
			}, {
				shoppingcart: []
			})
			
			return ctx.success({
				data: {
					orderNo
				}
			})
		}
		catch(e) {
			return ctx.error()
		}
		finally {
			// 解锁
			cache.del('create_order_lock')
		}
	}
	
	
	// 支付
	static async paymentOrder(ctx, next) {
		try {
			const id = ctx.params.id
			const {uid} = ctx.state.jwt
			const {couponId} = ctx.request.body
			
			// 查找相关的订单
			const orderDoc = await OrderModel.findOne({
				orderNo: id,
				uid: uid,
				status: 1
			}, {
				__v: 0,
				_id: 0
			})
			
			// 如果找不到，报错
			if (!orderDoc || !orderDoc.needPayment) {
				return ctx.error({
					msg: '找不到相关的订单'
				})
			}

			// 如果有优惠券，验证它是不是可用
			let choosedCoupon = null
			let total_fee = orderDoc.needPayment
			if (couponId) {
				let couponDoc = await UserModel.findOne({
					_id: uid
				}, 'couponList')

				couponDoc = couponDoc.couponList ? couponDoc.couponList : []
				
				for (let i = 0; i < couponDoc.length; i++) {
					const d = couponDoc[i]

					// 条件，id匹配、总费用大于优惠券的使用条件、未过期、未使用
					if (d.id == couponId && !d.used && orderDoc.totalPrice >= d.condition && d.expiredTime > new Date()) {
						choosedCoupon = d
						break
					}
				}

				if (!choosedCoupon || !choosedCoupon.worth) {
					return ctx.error({
						msg: '该优惠券不可用'
					})
				}
				
				// 总支付金额减掉优惠券的抵扣
				total_fee = orderDoc.needPayment - choosedCoupon.worth
				
				// 如果被减到0，改成1，即必须支付一次
				if (!total_fee) {
					total_fee = 1
				}
			}

			// 到这一步，说明订单和优惠券都验证通过了，开始请求微信支付

			// 生成订单失效时间
			const time_expire = dateFormat(orderDoc.paymentTimeout, 'yyyymmddhhMMss')
			
			// 商品简单描述
			const body = '爱泽阳光ivcsun-爱泽阳光商城支付'
			
			// 客户端ip
			const spbill_create_ip = ctx.ip.replace(/^::\D+:/g, '')

			// 生成签名
			const stringA = `appid=${WX.appID}&body=${body}&device_info=WEB&mch_id=${WX.mchID}&nonce_str=${id}`
			const stringSign = md5(stringA + '&key=' + WX.key).toUpperCase()

			const data = {
				appid: WX.appID, // 微信支付分配的公众账号ID
				mch_id: WX.mchID, // 微信支付分配的商户号
				device_info: 'WEB',
				nonce_str: id, // 随机字符串，长度要求在32位以内。
				sign: stringSign, // 通过签名算法计算得出的签名值，详见签名生成算法
				body: body, // 商品简单描述，该字段请按照规范传递，具体请见参数规定
				out_trade_no: id, // 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
				total_fee: total_fee, // 订单总金额，单位为分，详见支付金额
				spbill_create_ip: spbill_create_ip, // APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
				time_expire: time_expire, // 订单失效时间，格式为yyyyMMddHHmmss
				notify_url: 'http://www.ivcsun.com/server/api/wx/unifiedorder/callback', // 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
				trade_type: 'JSAPI',
			}

			// 将请求的值转为xml形式
			let xmlData = ''
			for (let i in data) {
				xmlData += '<' + i + '>' + data[i] + '</' + i + '>'
			}

			// 微信预支付
			const res = await axios.request({
				method: 'post',
				url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
				data: xmlData
			})
			
			// 失败
			if ((/FAIL/gi).test(res.data)) {
				return ctx.error({
					msg: res.data.replace(/^\D+<return_msg><!\[CDATA\[/gi, '').replace(/\]\]><\/return_msg>\D+/gi, ''),
					data: data
				})
			}
			// 成功
			else {
				return ctx.success()
			}
		}
		catch (e) {
			return ctx.error()
		}
	}	

}

module.exports = Control