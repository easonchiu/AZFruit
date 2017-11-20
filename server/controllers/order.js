var OrderModel = require('../models/order')
var ShoppingcartCon = require('./shoppingcart')
var SkuModel = require('../models/productSpec')

class Control {

	static async _fetchList(ctx, next, uid) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await OrderModel.count(uid ? {
				uid: uid
			} : null)
			let list = []

			if (count > 0) {
				const search = [{
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
					search.unshift({
						$match: {
							uid
						}
					})
				}

				list = await OrderModel.aggregate(search)
			}

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

	// 用户下单
	static async create(ctx, next) {
		try {
			if (Control.lock) {
				return ctx.error({
					msg: '系统繁忙，请稍后再试'
				})
			}

			// 上锁
			Control.lock = true

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
						Control.lock = false
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
				Control.lock = false
				return ctx.error({
					msg: '购物车中没有可购买的产品'
				})
			}

			// 创建个订单号，订单号为当前系统时间的毫秒级，保证不会重复
			const now = new Date()
			const yyyy = now.getFullYear()
			const mm = ('0000' + (now.getMonth() + 1)).substr(-2)
			const dd = ('0000' + now.getDate()).substr(-2)
			const h = ('0000' + now.getHours()).substr(-2)
			const m = ('0000' + now.getMinutes()).substr(-2)
			const s = ('0000' + now.getSeconds()).substr(-2)
			const ms = ('0000' + now.getMilliseconds()).substr(-4)
			const orderNo = yyyy + mm + dd + h + m + s + ms
			
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
				productList: info.list
			})

			// 清空购物车
			await ShoppingcartCon.removeAll(uid)
			
			// 解锁
			Control.lock = false
			return ctx.success()
		}
		catch(e) {
			// 解锁
			Control.lock = false
			return ctx.error()
		}
	}

}

module.exports = Control