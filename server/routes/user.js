var router = require('koa-router')()
var prefix = require('../conf/prefix')
var user = require('../controllers/user')

router
	.prefix(`${prefix}/user`)
	// 登录
	.post('/login', user.login)
	// 注册
	.post('/register', user.register)

module.exports = router