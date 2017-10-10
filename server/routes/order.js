var router = require('koa-router')()
var prefix = require('../conf/prefix')
var order = require('../controllers/order')

router
	// 获取列表
	.get(`${prefix.api}/order/list`, order.fetchList)
	// 获取详情
	.get(`${prefix.api}/order/detail/:id`, order.fetchDetail)
	
	// 用户下单
	.post(`${prefix.app}/order`, order.appCreateOrder)

module.exports = router