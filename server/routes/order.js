var router = require('koa-router')()
var prefix = require('../conf/prefix')
var order = require('../controllers/order')
var jwt = require('../middlewares/jwt')

router
	// 获取列表
	.get(`${prefix.api}/order/list`, jwt, order.fetchList)
	// 获取详情
	.get(`${prefix.api}/order/detail/:id`, jwt, order.fetchDetail)
	
	// 用户下单
	.post(`${prefix.app}/order`, order.appCreateOrder)

module.exports = router