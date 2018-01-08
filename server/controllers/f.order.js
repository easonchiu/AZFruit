var OrderModel = require('../models/order')
var ShoppingcartCon = require('./f.shoppingcart')
var SkuModel = require('../models/sku')
var PostageModel = require('../models/postage')
var UserModel = require('../models/user')

var cache = require('memory-cache')
var axios = require('axios')
var WX = require('../conf/wx')
var dateFormat = require('dateformat')
var md5 = require('md5')
var xml2json = require('xml2json')



class Control {

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
		try {
			let { type = 1 } = ctx.query
			const {uid} = ctx.state.jwt

			let list = []

			// 进行中的订单
			if (type == 1) {
				list = await OrderModel.aggregate([
					{ $match: { uid: uid, status: 1, paymentTimeout: { '$gt': new Date() } } },
					{ $sort: { createTime: -1 } },
					{ $project: { _id: 0, __v: 0 } }
				])
			}
			// 已完成的订单
			else if (type == 2) {
				list = await OrderModel.history.aggregate([
					{ $match: { uid: uid } },
					{ $sort: { createTime: -1 } },
					{ $project: { _id: 0, __v: 0 } }
				])
			}

			return ctx.success({
				data: {
					list
				}
			})
		} catch(e) {
			return ctx.error()
		}
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
			}, 'coupon')

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

				// 如果有使用优惠券，解锁
				if (doc.coupon) {
					await UserModel.update({
						_id: uid,
						'couponList.id': doc.coupon.id
					}, {
						$set: {
							'couponList.$.locked': false
						}
					})
				}

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

			const {id} = ctx.params

			const {flag} = ctx.query

			// 详情必须要有flag，来区分查不同的表
			if (flag != 1 && flag != 2) {
				return ctx.error({
					msg: 'flag参数错误'
				})
			}

			let res = null
			
			// 查询条件
			const query = [
				{ orderNo: id, uid },
				{ __v: 0, _id: 0 }
			]
			
			// 查进行中的订单
			if (flag == 1) {
				res = await OrderModel.findOne(query[0], query[1])
			}
			// 查已完成的订单
			else {
				res = await OrderModel.history.findOne(query[0], query[1])
				
				// 如果没找到，再去flag=1的表里再查查
				if (!res) {
					res = await OrderModel.findOne(query[0], query[1])
				}
			}

			if (res) {
				// 待支付的订单
				if (res.status === 1) {
					// 如果是待支付的话，计算剩余支付时间
					const now = new Date()
					const timeout = Math.round((res.paymentTimeout.getTime() - now.getTime()) / 1000)

					// 如果还在支付时间内
					if (timeout > 0) {
						// 在返回参数中修改值
						res._doc.paymentTimeout = timeout

						return ctx.success({
							data: res
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
			// 验证addressid是否有
			else if (!body.addressId) {
				return ctx.error({
					msg: '没有地址信息'
				})
			}

			// 获取用户openid信息
			const userDoc = await UserModel.findOne({
				_id: uid
			}, 'openId addressList couponList')
			
			if (!userDoc.openId) {
				return ctx.error({
					msg: 'openid错误',
					code: 4001
				})
			}
			else if (!userDoc.addressList || !userDoc.addressList.length) {
				return ctx.error({
					msg: '您还没有创建收货地址哦~'
				})
			}

			// 找到相关的那个地址
			let choosedAddress = null
			for (let i = 0, data = userDoc.addressList; i < data.length; i++) {
				if (data[i].id == body.addressId) {
					choosedAddress = data[i]
					break
				}
			}
			
			// 如果没有找到相应的地址
			if (!choosedAddress) {
				return ctx.error({
					msg: '没有地址信息'
				})
			}

			// 获取购物车内的信息
			const spcDoc = await ShoppingcartCon.getShoppingcartInfoWithUser(uid)

			// 验证购物车内所有商品的库存
			if (spcDoc.list && spcDoc.list.length) {
				// 如果库存不够，提示
				for (let i = 0; i < spcDoc.list.length; i++) {
					const data = spcDoc.list[i]
					if (data.stock < data.amount) {
						return ctx.error({
							msg: '购物车中的' + data.name + '库存不够'
						})
					}
				}
			}
			else {
				return ctx.error({
					msg: '购物车中没有可购买的产品'
				})
			}

			// 地址的距离要x1.2，并存到返回数据中
			choosedAddress.distance *= 1.2

			// 根据距离、重量、价格计算运费
			const postage = await PostageModel.expense(choosedAddress.distance, spcDoc.totalPrice, spcDoc.totalWeight)
			
			// 如果使用了优惠券
			let choosedCoupon = null
			if (body.couponId) {
				// 查到这张券
				const now = new Date()
				for (let i = 0, data = userDoc.couponList; i < data.length; i++) {
					const d = data[i]
					if (d.id == body.couponId && d.condition < spcDoc.totalPrice && d.expiredTime > now && !d.used && !d.locked) {
						choosedCoupon = d
						break
					}
				}
				// 如果找不到，报错
				if (!choosedCoupon) {
					return ctx.error({
						msg: '没有找到相关的优惠券'
					})
				}
			}

			// 计算最终支付金额
			let paymentPrice = spcDoc.totalPrice + postage
			if (choosedCoupon) {
				paymentPrice -= choosedCoupon.worth
				if (paymentPrice <= 0) {
					paymentPrice = 1
				}
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
				openId: userDoc.openId,
				address: choosedAddress,
				coupon: choosedCoupon,
				list: spcDoc.list,
				totalWeight: spcDoc.totalWeight,
				totalPrice: spcDoc.totalPrice,
				paymentPrice: paymentPrice,
				postage: postage,
				paymentTimeout: after30m
			}).create()

			// 清空购物车
			await UserModel.update({
				_id: uid
			}, {
				shoppingcart: []
			})

			// 完成前的最后一步，占据商品库存，锁定优惠券
			await SkuModel.occupyStock(spcDoc.list)
			
			if (body.couponId) {
				await UserModel.update({
					_id: uid,
					'couponList.id': body.couponId
				}, {
					$set: {
						'couponList.$.locked': true
					}
				})
			}
			
			return ctx.success({
				data: {
					orderNo
				}
			})
		}
		catch(e) {
			console.log(e)
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

			// 查找用户信息
			const userDoc = await UserModel.findOne({
				_id: uid
			}, 'couponList openId')
			
			// openid必须要有，若没有就报错
			if (!userDoc.openId) {
				return ctx.error({
					msg: '没有该用户的openId信息'
				})
			}

			// 如果有优惠券，验证它是不是可用
			let choosedCoupon = null
			let total_fee = orderDoc.needPayment
			if (couponId) {
				const couponDoc = userDoc.couponList ? userDoc.couponList : []
				
				for (let i = 0; i < couponDoc.length; i++) {
					const d = couponDoc[i]

					// 条件，id匹配、总费用大于优惠券的使用条件、未过期、未使用
					if (d.id == couponId && !d.used && !d.locked && orderDoc.totalPrice >= d.condition && d.expiredTime > new Date()) {
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
				if (total_fee <= 0) {
					total_fee = 1
				}
			}

			// 到这一步，说明订单和优惠券都验证通过了，开始请求微信支付

			// 生成订单失效时间
			const after10m = new Date((new Date()).getTime() + 1000 * 60 * 10)
			const time_expire = dateFormat(after10m, 'yyyymmddHHMMss')
			
			// 商品简单描述
			const body = '爱泽阳光ivcsun-爱泽阳光商城支付'
			
			// 客户端ip
			const spbill_create_ip = ctx.request.ip.replace(/^::\D+:/g, '')

			// 异步接收地址
			const notify_url = 'http://www.ivcsun.com/server/api/wx/unifiedorder/callback'

			// 生成签名
			const stringA = `appid=${WX.appID}&body=${body}&device_info=WEB&mch_id=${WX.mchID}&nonce_str=${id}&notify_url=${notify_url}&openid=${userDoc.openId}&out_trade_no=${id}&sign_type=MD5&spbill_create_ip=${spbill_create_ip}&time_expire=${time_expire}&total_fee=${total_fee}&trade_type=JSAPI`
			const stringSign = md5(stringA + '&key=' + WX.key).toUpperCase()

			const data = {
				appid: WX.appID, // 微信支付分配的公众账号ID
				mch_id: WX.mchID, // 微信支付分配的商户号
				device_info: 'WEB',
				nonce_str: id, // 随机字符串，长度要求在32位以内。
				sign: stringSign, // 通过签名算法计算得出的签名值，详见签名生成算法
				sign_type: 'MD5',
				body: body, // 商品简单描述，该字段请按照规范传递，具体请见参数规定
				out_trade_no: id, // 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
				total_fee: total_fee, // 订单总金额，单位为分，详见支付金额
				spbill_create_ip: spbill_create_ip, // APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
				time_expire: time_expire, // 订单失效时间，格式为yyyyMMddHHmmss
				notify_url: notify_url, // 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
				trade_type: 'JSAPI',
				openid: userDoc.openId
			}

			// 将请求的值转为xml形式
			let xmlData = '<xml>'
			for (let i in data) {
				xmlData += '<' + i + '>' + data[i] + '</' + i + '>'
			}
			xmlData += '</xml>'

			// 微信预支付
			const res = await axios.request({
				method: 'post',
				url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
				data: xmlData
			})
			
			// 失败
			if ((/FAIL/gi).test(res.data)) {
				return ctx.error({
					data: xmlData,
					msg: res.data.replace(/^\D+<return_msg><!\[CDATA\[/gi, '').replace(/\]\]><\/return_msg>\D+/gi, '')
				})
			}
			// 成功
			else {
				const obj = JSON.parse(xml2json.toJson(res.data)).xml || {}
				return ctx.success({
					data: {
						appid: obj.appid,
						time_stamp: Math.round(new Date().getTime() / 1000).toString(),
						nonce_str: obj.nonce_str,
						sign_type: 'MD5',
						sign: stringSign,
						prepay_id: obj.prepay_id,
						xml: res.data
					}
				})
			}
		}
		catch (e) {
			return ctx.error()
		}
	}	

}

module.exports = Control