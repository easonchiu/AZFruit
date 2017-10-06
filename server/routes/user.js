var router = require('koa-router')()
var prefix = require('../conf/prefix')
var user = require('../controllers/user')

router
	// 后端接口
	.prefix(`${prefix.api}/user`)
	// 获取列表
	.get('/list', user.fetchList)
	// 查看详情
	.get('/detail/:id', user.fetchDetail)
	// 前端接口
	.prefix(`${prefix.app}/user`)
	// 注册
	.post('/register', user.fetchList)
	// 登录
	.post('/login', user.fetchList)

module.exports = router