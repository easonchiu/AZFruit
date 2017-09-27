var router = require('koa-router')()
var prefix = require('../conf/prefix')
var product = require('../controllers/product')

router
	.prefix(`${prefix}/product`)
	// 获取列表
	.get('/list', product.fetchList)
	// 获取详情
	.get('/:id/detail', product.fetchDetail)
	// 修改详情
	.patch('/:id/detail', product.editDetail)

module.exports = router