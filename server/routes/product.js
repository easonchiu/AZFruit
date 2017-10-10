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
	
	// 前端获取列表
	.get(`${prefix.app}/product/list`, product.appFetchList)
	// 前端获取详情
	.get(`${prefix.app}/product/detail/:id`, product.appFetchDetail)
	// 前端获取评论
	.get(`${prefix.app}/product/detail/:id/comment`, product.appFetchComment)
	// 前端添加评论
	.post(`${prefix.app}/product/detail/:id/comment`, product.appCreateComment)

module.exports = router