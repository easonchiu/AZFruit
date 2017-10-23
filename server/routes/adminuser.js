var router = require('koa-router')()
var prefix = require('../conf/prefix')
var adminuser = require('../controllers/adminuser')

router
	// 初始化
	.post(`${prefix.api}/adminuser`, adminuser.create)
	// 登录
	.post(`${prefix.api}/adminuser/login`, adminuser.login)
	

module.exports = router