var User = require('../model/user')

class user {
	static async add(ctx, next) {

		const res = await User.create({
			
		})
		
		return ctx.body = res
	}

}

module.exports = user