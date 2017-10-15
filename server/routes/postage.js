var router = require('koa-router')()
var prefix = require('../conf/prefix')
var control = require('../controllers/postage')

router
	// 添加运费
	.post(`${prefix.api}/postage`, control.create)
	// 删除运费
	.delete(`${prefix.api}/postage/detail/:id`, control.remove)
	// 修改运费
	.patch(`${prefix.api}/postage/detail/:id`, control.update)
	// 获取运费列表
	.get(`${prefix.api}/postage/list`, control.fetchList)
	// 获取运费详情
	.get(`${prefix.api}/postage/detail/:id`, control.fetchDetail)
	
module.exports = router