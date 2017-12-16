var OrderModel = require('../models/order')
var ShoppingcartCon = require('./shoppingcart')
var SkuModel = require('../models/sku')
var UserModel = require('../models/user')

var cache = require('memory-cache')
var axios = require('axios')
var WX = require('../conf/wx')

class Control {

	static async _fetchList(ctx, next, uid) {
		try {
			let { skip = 0, limit = 10, type = 1 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const search = [{
				$sort: {
					createTime: -1,
				}
			}, {
				$project: {
					_id: 0,
					id: '$_id',
					orderNo: 1,
					wxOrderNo: 1,
					city: 1,
					cityCode: 1,
					zipCode: 1,
					mobile: 1,
					name: 1,
					area: 1,
					address: 1,
					goodsList: 1,
					totalWeight: 1,
					totalPrice: 1,
					needPayment: 1,
					status: 1,
					createTime: 1,
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

			const list = await OrderModel.aggregate(search) || []

			return ctx.success({
				data: {
					list,
					count: 0,
					skip,
					limit,
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 获取订单列表
	static async fetchList(ctx, next) {
		return await Control._fetchList(ctx, next)
	}

	// 用户获取订单列表
	static async appFetchList(ctx, next) {
		const {uid} = ctx.state.jwt
		return await Control._fetchList(ctx, next, uid)
	}
	
	// 获取订单详情
	static async fetchDetail(ctx, next) {
		try {
			const id = ctx.params.id
			
			// 查询相关的订单
			const res = await OrderModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})
			
			// 如果有找到，返回
			if (res) {
				return ctx.success({
					data: res
				})
			}
			else {
				return ctx.error({
					msg: '找不到相关订单'
				})
			}
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 用户取消订单
	static async appCancelOrder(ctx, next) {
		try {
			const {uid} = ctx.state.jwt

			const id = ctx.params.id

			// 查找相关且未支付的订单
			const res = await OrderModel.findOne({
				uid,
				orderNo: id,
				status: 1
			})

			// 找到订单
			if (res) {
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
				if (res.status && res.status !== 1) {
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
	static async appFetchDetail(ctx, next) {
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

							// 把_id改为id
							resCoupons = resCoupons.map(c => {
								var resc = Object.assign({}, c._doc)
								resc.id = resc._id
								
								// 如果有选择coupon，找到匹配中的
								if (couponId && couponId == resc.id) {
									choosedCoupon = resc
								}

								delete resc._id
								return resc
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
			
			// 如果没有openid，一般都会有
			if (!uid || !body.openid) {
				return ctx.error({
					msg: '身份信息错误'
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
			const count = cache.get('orderCount') ? +cache.get('orderCount') + 1 : '123'
			const nextCount = count > 999 ? '123' : count
			cache.put('orderCount', nextCount)
			const orderNo = yy + mm + dd + h + m + s + count
			
			// 订单需要30分钟内支付
			const after30m = new Date(now.getTime() + 1000 * 60 * 30)

			// 生成订单（注意生成的订单中不包含优惠券）
			const res = await OrderModel.create({
				orderNo,
				wxOrderNo: '',
				uid: uid,
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
			})

			if (res) {
				// 请求的传参
				const data = {
					appid: WX.appID, // 微信支付分配的公众账号ID
					mch_id: WX.mchID, // 微信支付分配的商户号
					nonce_str: 'suobian', // 随机字符串，长度要求在32位以内。
					sign: 'sign', // 通过签名算法计算得出的签名值，详见签名生成算法
					body: '商品描述-商品描述', // 商品简单描述，该字段请按照规范传递，具体请见参数规定
					out_trade_no: orderNo, // 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
					total_fee: 1, // 订单总金额，单位为分，详见支付金额
					spbill_create_ip: '123', // APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
					time_expire: '20191227091010', // 订单失效时间，格式为yyyyMMddHHmmss
					notify_url: 'async notice', // 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
					trade_type: 'JSAPI',
				}

				// 将请求的值转为xml形式
				let xmlData = ''
				for (let i in data) {
					xmlData += '<' + i + '>' + data[i] + '</' + i + '>'
				}

				// 微信预支付
				const pre = await axios.request({
					method: 'post',
					url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
					data: xmlData
				})
			}
			else {
				return ctx.error({
					msg: '订单创建失败'
				})
			}
			return

			// 清空购物车
			await ShoppingcartCon.removeAll(uid)
			
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
	
	

}

module.exports = Control