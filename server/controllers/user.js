var User = require('../models/user')

class user {
	static async fetchList(ctx, next) {

		const res = await User.create({
			
		})
		
		return ctx.body = res
	}
	
	static async fetchDetail(ctx, next) {

		const res = await User.create({
			
		})
		
		return ctx.body = res
	}
}

module.exports = user