var router = require('koa-router')()
var prefix = require('../conf/prefix')
var f_user = require('../controllers/f.user')
var b_user = require('../controllers/b.user')
var jwt = require('../middlewares/jwt')
var clientJWT = require('../middlewares/clientJwt')

router
	// 获取列表
	.get(`${prefix.api}/user/list`, jwt, b_user.fetchList)
	// 查看详情
	.get(`${prefix.api}/user/detail/:id`, jwt, b_user.fetchDetail)
	
	// 前端登录（没有则注册）
	.post(`${prefix.app}/user/login`, f_user.login)
	// 前端获取验证码
	.post(`${prefix.app}/user/verifcode`, f_user.getVerifcode)
	// 前端获取用户基本信息
	.get(`${prefix.app}/user`, clientJWT, f_user.fetchBaseInfo)


module.exports = router