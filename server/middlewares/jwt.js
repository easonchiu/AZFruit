var jwt = require('koa-jwt')
var jwtKey = require('../conf/jwtKey')

module.exports =  jwt({
	secret: jwtKey
})