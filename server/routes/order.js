var router = require('koa-router')()
var prefix = require('../conf/prefix')
var order = require('../controllers/order')
var jwt = require('../middlewares/jwt')
var checkJWT = require('../middlewares/clientJwt')

router
	// 获取列表
	.get(`${prefix.api}/order/list`, jwt, order.fetchList)
	// 获取详情
	.get(`${prefix.api}/order/detail/:id`, jwt, order.fetchDetail)
	
	// 用户下单
	.post(`${prefix.app}/order`, checkJWT, order.create)
	// 用户查看订单列表
	.get(`${prefix.app}/order/list`, checkJWT, order.appFetchList)
	// 用户查看订单详情
	.get(`${prefix.app}/order/detail/:id`, checkJWT, order.appFetchDetail)
	// 用户取消订单
	.patch(`${prefix.app}/order/:id`, checkJWT, order.appCancelOrder)

module.exports = router