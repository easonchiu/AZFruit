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

	// 用户端获取首页推荐列表
	.get(`${prefix.app}/product/recommend/list`, product.appFetchRecommendList)
	// 用户端获取全部产品列表
	.get(`${prefix.app}/product/list`, product.appFetchList)
	// 用户端获取销量排行产品列表
	.get(`${prefix.app}/product/top10/list`, product.appFetchTop10List)
	// 用户端获取产品详情
	.get(`${prefix.app}/product/detail/:id`, product.appFetchDetail)
	// 用户端获取产品规格
	.get(`${prefix.app}/product/spec/:id`, productSpec.appFetchSpec)

module.exports = router