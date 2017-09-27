var router = require('koa-router')()
var prefix = require('../conf/prefix')
var order = require('../controllers/order')

router
	.prefix(`${prefix}/order`)
	// 获取列表
	.get('/list', order.fetchList)
	// 获取详情
	.get('/:id/detail', order.fetchDetail)

module.exports = router