var Banner = require('../model/banner')

class banner {
	static async add(ctx, next) {

		const res = await Banner.create({
			
		})
		
		return ctx.body = res
	}

}

module.exports = banner