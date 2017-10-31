var jwt = require('koa-jwt')
var jwtKey = require('../conf/clientJwtKey')

module.exports =  jwt({
	secret: jwtKey
})