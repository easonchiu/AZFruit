var router = require('koa-router')()
var prefix = require('../conf/prefix')
var shoppingcart = require('../controllers/shoppingcart')
var jwt = require('../middlewares/jwt')

router
	// 添加商品
	.post(`${prefix.app}/shoppingcart`, shoppingcart.add)
	// 获取购物车商品
	.get(`${prefix.app}/shoppingcart/list`, shoppingcart.fetch)
	// 更新某个商品的数量
	.patch(`${prefix.app}/shoppingcart`, shoppingcart.update)
	// 删除某个商品的数量
	.delete(`${prefix.app}/shoppingcart`, shoppingcart.remove)
	// 获取购物车商品的数量
	.get(`${prefix.app}/shoppingcart/count`, shoppingcart.fetchCount)
	
module.exports = router