var router = require('koa-router')()
var prefix = require('../conf/prefix')
var shoppingcart = require('../controllers/shoppingcart')
var jwt = require('../middlewares/clientJwt')

router
	// 添加商品
	.post(`${prefix.app}/shoppingcart`, jwt, shoppingcart.add)
	// 获取购物车商品
	.get(`${prefix.app}/shoppingcart/list`, jwt, shoppingcart.fetch)
	// 更新某个商品的数量
	.patch(`${prefix.app}/shoppingcart`, jwt, shoppingcart.update)
	// 删除某个商品的数量
	.delete(`${prefix.app}/shoppingcart`, jwt, shoppingcart.remove)
	// 获取购物车商品的数量
	.get(`${prefix.app}/shoppingcart/count`, jwt, shoppingcart.fetchCount)
	
module.exports = router