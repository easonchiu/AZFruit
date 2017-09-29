var Order = require('../model/order')

class order {
	static async add(ctx, next) {

		const res = await Order.create({
			
		})
		
		return ctx.body = res
	}

}

module.exports = order