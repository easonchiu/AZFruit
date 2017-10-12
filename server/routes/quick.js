var router = require('koa-router')()
var prefix = require('../conf/prefix')
var quick = require('../controllers/quick')

router
	// 添加快捷
	.post(`${prefix.api}/quick`, quick.create)
	// 删除快捷
	.delete(`${prefix.api}/quick/detail/:id`, quick.remove)
	// 修改快捷
	.patch(`${prefix.api}/quick/detail/:id`, quick.update)
	// 获取快捷列表
	.get(`${prefix.api}/quick/list`, quick.fetchList)
	// 获取快捷详情
	.get(`${prefix.api}/quick/detail/:id`, quick.fetchDetail)
	
module.exports = router