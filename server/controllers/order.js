var OrderModel = require('../models/order')
var ShoppingcartCon = require('./shoppingcart')
var SkuModel = require('../models/productSpec')
var cache = require('memory-cache')

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
					productList: 1,
					totalWeight: 1,
					totalPrice: 1,
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
		return Control._fetchList(ctx, next)
	}

	// 用户获取订单列表
	static async appFetchList(ctx, next) {
		const {uid} = ctx.state.jwt
		return Control._fetchList(ctx, next, uid)
	}
	
	// 获取订单详情
	static async fetchDetail(ctx, next) {
		const res = await OrderModel.create({
			
		})
		
		return ctx.body = res
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
			}, {
				__v: 0,
				_id: 0,
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
				
				// 还库存
				await Control.revertStock(res.productList)

				return ctx.success()
			}
			// 未找到订单
			else {
				if (res.status && res.status !== 1) {
					return ctx.error({
						msg: '订单无法关闭'
					})
				} else {
					return ctx.error()
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
				_id: 0,
			})

			if (res) {
				// 待支付的订单
				if (res.status === 1) {
					// 如果还在支付时间内
					if (res.paymentTimeoutSec > 0) {
						return ctx.success({
							data: res
						})
					}
					// 如果已经过了支付时间
					else {
						// 要将订单状态改为交易关闭
						await OrderModel.update({
							uid,
							orderNo: id
						}, {
							$set: {
								status: 90
							}
						})
						
						// 还库存
						await Control.revertStock(res.productList)

						return ctx.error({
							msg: '订单超时未支付，请重新下单',
							code: 90
						})
					}
				}
				// 如果订单状态不为待支付，直接将查询结果返回
				else if (res.status !== 1) {
					return ctx.success({
						data: res
					})
				} else {
					return ctx.error()
				}
			} else {
				return ctx.error()
			}
		} catch(e) {
			return ctx.error()
		}
	}

	// 用户下单
	static async create(ctx, next) {
		try {
			if (cache.get('lock')) {
				return ctx.error({
					msg: '系统繁忙，请稍后再试'
				})
			}

			// 上锁
			cache.put('lock', true)

			const body = ctx.request.body

			const {uid} = ctx.state.jwt

			// 获取购物车内的信息
			const info = await ShoppingcartCon.getShoppingcartInfo(uid, body.addressid)

			if (info.list && info.list.length) {
				// 如果库存不够，提示
				for (let i = 0; i < info.list.length; i++) {
					const data = info.list[i]

					if (data.stock < data.amount) {
						// 解锁
						cache.del('lock')
						return ctx.error({
							msg: '购物车中的' + data.name + '库存不够'
						})
					}
				}
				
				// 库存数量都够的情况下，在数据库中减掉库存，增加销量
				for (let i = 0; i < info.list.length; i++) {
					const data = info.list[i]

					await SkuModel.update({
						_id: data.specId
					}, {
						$inc: {
							stock: -data.amount,
							sellCount: data.amount,
						}
					})
				}
			}
			else {
				// 解锁
				cache.del('lock')
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

			// 生成订单
			await OrderModel.create({
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
				needPayment: info.totalPrice,
				finalPayment: 0,
				status: 1,
				productList: info.list,
				paymentTimeout: after30m
			})

			// 清空购物车
			await ShoppingcartCon.removeAll(uid)
			
			// 解锁
			cache.del('lock')
			return ctx.success({
				data: {
					orderNo
				}
			})
		}
		catch(e) {
			// 解锁
			cache.del('lock')
			return ctx.error()
		}
	}
	
	// 归还库存
	static async revertStock(list) {
		return new Promise(async (resolve, reject) => {
			for (let i = 0; i < list.length; i++) {
				const data = list[i]
				await SkuModel.update({
					_id: data.specId
				}, {
					$inc: {
						stock: data.amount,
						sellCount: -data.amount,
					}
				})
			}

			resolve()
		})
	}

}

module.exports = Control