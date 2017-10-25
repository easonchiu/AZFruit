var router = require('koa-router')()
var prefix = require('../conf/prefix')
var user = require('../controllers/user')
var jwt = require('../middlewares/jwt')

router
	// 获取列表
	.get(`${prefix.api}/user/list`, jwt, user.fetchList)
	// 查看详情
	.get(`${prefix.api}/user/detail/:id`, jwt, user.fetchDetail)
	
	// 前端登录（没有则注册）
	.post(`${prefix.app}/user/login`, user.login)
	// 前端添加地址
	.post(`${prefix.app}/user/address`, user.createAddress)

module.exports = router