var router = require('koa-router')()
var prefix = require('../conf/prefix')
var product = require('../controllers/product')
var productSpec = require('../controllers/productSpec')

router
	// 创建产品
	.post(`${prefix.api}/product`, product.create)
	// 获取列表
	.get(`${prefix.api}/product/list`, product.fetchList)
	// 获取详情
	.get(`${prefix.api}/product/detail/:id`, product.fetchDetail)
	// 修改详情
	.patch(`${prefix.api}/product/detail/:id`, product.update)

	// 创建产品规格
	.post(`${prefix.api}/product/spec`, productSpec.create)
	// 获取规格列表
	.get(`${prefix.api}/product/spec/list`, productSpec.fetchList)
	// 获取规格详情
	.get(`${prefix.api}/product/spec/detail/:id`, productSpec.fetchDetail)
	// 修改规格详情
	.patch(`${prefix.api}/product/spec/detail/:id`, productSpec.update)
	// 删除规格
	.delete(`${prefix.api}/product/spec/detail/:id`, productSpec.remove)
	

module.exports = router