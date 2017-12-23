var router = require('koa-router')()
var prefix = require('../conf/prefix')
var f_shoppingcart = require('../controllers/f.shoppingcart')
var clientJWT = require('../middlewares/clientJwt')

router
	// 添加商品
	.post(`${prefix.app}/shoppingcart`, clientJWT, f_shoppingcart.add)
	// 获取购物车商品
	.get(`${prefix.app}/shoppingcart/list`, clientJWT, f_shoppingcart.fetchList)
	// 更新某个商品的数量
	.patch(`${prefix.app}/shoppingcart`, clientJWT, f_shoppingcart.update)
	// 删除某个商品的数量
	.delete(`${prefix.app}/shoppingcart`, clientJWT, f_shoppingcart.remove)
	// 获取购物车商品的数量
	.get(`${prefix.app}/shoppingcart/amount`, clientJWT, f_shoppingcart.fetchAmount)
	
module.exports = router