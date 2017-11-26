var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/clientJwtKey')
var User = require('../models/user')

// 验证jwt
module.exports = async (ctx, next) => {
	if (!ctx.header || !ctx.header.authorization) {
		return ctx.error(401)
	}

	const token = ctx.header.authorization.replace('Bearer ', '')

	try {
		const res = jwt.verify(token, jwtKey)

		if (!res.uid) {
			return ctx.error()
		}

		ctx.state.jwt = res
		return await next()

		// const info = await User.findOne({
		// 	token: res.token,
		// 	_id: res.uid
		// })

		// if (info) {
		// 	ctx.state.jwt = res
		// 	return await next()
		// }
		// else {
		// 	return ctx.error({})
		// }
	} catch(e) {
		return ctx.error(401)
	}
	
}