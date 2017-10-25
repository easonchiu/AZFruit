var router = require('koa-router')()
var prefix = require('../conf/prefix')
var quick = require('../controllers/quick')
var jwt = require('../middlewares/jwt')

router
	// 添加快捷
	.post(`${prefix.api}/quick`, jwt, quick.create)
	// 删除快捷
	.delete(`${prefix.api}/quick/detail/:id`, jwt, quick.remove)
	// 修改快捷
	.patch(`${prefix.api}/quick/detail/:id`, jwt, quick.update)
	// 获取快捷列表
	.get(`${prefix.api}/quick/list`, jwt, quick.fetchList)
	// 获取快捷详情
	.get(`${prefix.api}/quick/detail/:id`, jwt, quick.fetchDetail)

	// 用户端获取列表
	.get(`${prefix.app}/quick/list`, quick.appFetchList)
	
module.exports = router