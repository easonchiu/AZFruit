var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/clientJwtKey')

// 是否有权限操作
module.exports = ctx => {
	const _token = ctx.header.authorization.replace('Bearer ', '')
	const _userInfo = jwt.verify(_token, jwtKey)

	return _userInfo
}