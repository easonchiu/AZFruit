var User = require('../models/user')

class user {
	static async login(ctx, next) {

		const res = await User.create({
			
		})
		
		return ctx.body = res
	}
	
	static async register(ctx, next) {

		const res = await User.create({
			
		})
		
		return ctx.body = res
	}
}

module.exports = user