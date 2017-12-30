var router = require('koa-router')()
var prefix = require('../conf/prefix')
var f_quick = require('../controllers/f.quick')
var b_quick = require('../controllers/b.quick')
var jwt = require('../middlewares/jwt')

router
	// 添加快捷
	.post(`${prefix.api}/quick`, jwt, b_quick.save)
	// 删除快捷
	.delete(`${prefix.api}/quick/detail/:id`, jwt, b_quick.remove)
	// 修改快捷
	.patch(`${prefix.api}/quick/detail/:id`, jwt, b_quick.save)
	// 获取快捷列表
	.get(`${prefix.api}/quick/list`, jwt, b_quick.fetchList)
	// 获取快捷详情
	.get(`${prefix.api}/quick/detail/:id`, jwt, b_quick.fetchDetail)

	// 用户端获取列表
	.get(`${prefix.app}/quick`, f_quick.fetchList)
	
module.exports = router