var router = require('koa-router')()
var prefix = require('../conf/prefix')
var order = require('../controllers/order')
var jwt = require('../middlewares/jwt')
var clientJWT = require('../middlewares/clientJwt')

router
	// 获取列表
	.get(`${prefix.api}/order/list`, jwt, order.fetchList)
	// 获取详情
	.get(`${prefix.api}/order/detail/:id`, jwt, order.fetchDetail)
	
	// 用户下单
	.post(`${prefix.app}/order`, clientJWT, order.create)
	// 用户查看订单列表
	.get(`${prefix.app}/order`, clientJWT, order.appFetchList)
	// 用户获取进行中的订单数量
	.get(`${prefix.app}/order/amount`, clientJWT, order.appFetchAmount)
	// 用户查看订单详情
	.get(`${prefix.app}/order/:id`, clientJWT, order.appFetchDetail)
	// 用户取消订单
	.patch(`${prefix.app}/order/:id`, clientJWT, order.appCancelOrder)

module.exports = router