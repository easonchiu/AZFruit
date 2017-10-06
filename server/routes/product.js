var router = require('koa-router')()
var prefix = require('../conf/prefix')
var product = require('../controllers/product')

router
	.prefix(`${prefix.api}`)
	// 创建产品
	.post('/product', product.create)
	// 获取列表
	.get('/product/list', product.fetchList)
	// 获取详情
	.get('/product/detail/:id', product.fetchDetail)
	// 修改详情
	.patch('/product/detail/:id', product.update)
	// 前端获取列表
	.get(`${prefix.app}/product/list`, product.appFetchList)
	// 前端获取详情
	.get(`${prefix.app}/product/detail/:id`, product.appFetchDetail)
	// 前端获取评论
	.get(`${prefix.app}/product/detail/:id/comment`, product.appFetchComment)
	// 前端添加评论
	.post(`${prefix.app}/product/detail/:id/comment`, product.appCreateComment)

module.exports = router