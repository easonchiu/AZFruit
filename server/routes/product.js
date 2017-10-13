var router = require('koa-router')()
var prefix = require('../conf/prefix')
var product = require('../controllers/product')

router
	// 创建产品
	.post(`${prefix.api}/product`, product.create)
	// 获取列表
	.get(`${prefix.api}/product/list`, product.fetchList)
	// 获取详情
	.get(`${prefix.api}/product/detail/:id`, product.fetchDetail)
	// 修改详情
	.patch(`${prefix.api}/product/detail/:id`, product.update)
	

module.exports = router