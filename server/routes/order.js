var router = require('koa-router')()
var prefix = require('../conf/prefix')
var f_order = require('../controllers/f.order')
var b_order = require('../controllers/b.order')
var jwt = require('../middlewares/jwt')
var clientJWT = require('../middlewares/clientJwt')

router
	// 获取列表
	.get(`${prefix.api}/order/list`, jwt, b_order.fetchList)
	// 获取详情
	.get(`${prefix.api}/order/detail/:id`, jwt, b_order.fetchDetail)
	// 设置订单状态
	.patch(`${prefix.api}/order/:id/status`, jwt, b_order.updateStatus)
	
	// 用户下单
	.post(`${prefix.app}/order`, clientJWT, f_order.create)
	// 用户查看订单列表
	.get(`${prefix.app}/order`, clientJWT, f_order.fetchList)
	// 用户获取进行中的订单数量
	.get(`${prefix.app}/order/amount`, clientJWT, f_order.fetchAmount)
	// 用户查看订单详情
	.get(`${prefix.app}/order/:id`, clientJWT, f_order.fetchDetail)
	// 用户取消订单
	.patch(`${prefix.app}/order/:id`, clientJWT, f_order.cancelOrder)
	// 支付
	.post(`${prefix.app}/order/:id/payment`, clientJWT, f_order.paymentOrder)

module.exports = router