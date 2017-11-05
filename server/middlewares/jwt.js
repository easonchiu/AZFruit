var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/jwtKey')

// 验证jwt
module.exports = async (ctx, next) => {
	if (!ctx.header || !ctx.header.authorization) {
		return ctx.error(401)
	}

	const token = ctx.header.authorization.replace('Bearer ', '')

	try {
		ctx.state.jwt = jwt.verify(token, jwtKey)
		return await next()
	} catch(e) {
		return ctx.error(401)
	}
	
}