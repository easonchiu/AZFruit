var jwt = require('jsonwebtoken')
var key = '!@#zxc1357_azfruit'

// 验证jwt
module.exports = async (ctx, next) => {
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