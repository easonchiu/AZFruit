const jwt = require('jsonwebtoken')
const key = require('../conf/clientJwt')


class Jwt {
	static async check(ctx, next) {
		if (!ctx.header || !ctx.header.authorization) {
			return ctx.error(401)
		}

		const token = ctx.header.authorization.replace('Bearer ', '')

		try {
			ctx.jwt = jwt.verify(token, key)
			return await next()
		} catch(e) {
			return ctx.error(401)
		}
	}

	static createToken(data) {
	    return jwt.sign(data, key)
	}
}

module.exports = Jwt

