var Order = require('../models/order')
var Shoppingcart = require('./shoppingcart')

class Control {
	
	// 获取订单列表
	static async fetchList(ctx, next) {
		const res = await Order.create({
			
		})
		
		return ctx.body = res
	}
	
	// 获取订单详情
	static async fetchDetail(ctx, next) {
		const res = await Order.create({
			
		})
		
		return ctx.body = res
	}

	// 用户下单
	static async create(ctx, next) {
		try {
			const body = ctx.request.body

			const {uid} = ctx.state.jwt

			// 获取购物车内的信息
			const info = await Shoppingcart.getShoppingcartInfo(uid, body.addressid)

			// 如果购物车中的商品有下现象，提示用户
			if (info.hasDelete) {
				return ctx.error({
					msg: '购物车中的产品略有变化，请注意'
				})
			}

			// 查询购物车中的库存是不是够
			if (info.list.length) {
				for (let i = 0; i < info.list.length; i++) {
					const data = info.list[i]
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


			// 生成订单
			const orderNo = '123333333'

			const find = await Order.findOne({
				orderNo
			})

			if (orderNo) {
				return ctx.error({
					msg: '订单号重复'
				})
			}

			await Order.create({
				orderNo,
				wxOrderNo: '',
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
			await Shoppingcart.removeAll()

			return ctx.success()
		}
		catch(e) {
			return ctx.error()
		}
	}

}

module.exports = Control