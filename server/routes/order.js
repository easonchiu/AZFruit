var router = require('koa-router')()
var prefix = require('../conf/prefix')
var order = require('../controllers/order')

router
	.prefix(`${prefix.api}`)
	// 获取列表
	.get('/order/list', order.fetchList)
	// 获取详情
	.get('/order/detail/:id', order.fetchDetail)
	// 用户下单
	.post(`${prefix.app}/order`, order.appCreateOrder)

module.exports = router