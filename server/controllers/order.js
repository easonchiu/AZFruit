var Order = require('../models/order')

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
	static async appCreateOrder(ctx, next) {
		const res = await Order.create({
			
		})
		
		return ctx.body = res
	}
}

module.exports = Control