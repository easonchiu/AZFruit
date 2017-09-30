var Order = require('../models/order')

class order {
	static async fetchList(ctx, next) {

		const res = await Order.create({
			
		})
		
		return ctx.body = res
	}
	
	static async fetchDetail(ctx, next) {

		const res = await Order.create({
			
		})
		
		return ctx.body = res
	}
}

module.exports = order