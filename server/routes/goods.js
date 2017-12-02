var router = require('koa-router')()
var prefix = require('../conf/prefix')
var goods = require('../controllers/goods')
var sku = require('../controllers/sku')
var jwt = require('../middlewares/jwt')

router
	// 创建产品
	.post(`${prefix.api}/goods`, jwt, goods.create)
	// 获取列表
	.get(`${prefix.api}/goods/list`, jwt, goods.fetchList)
	// 获取详情
	.get(`${prefix.api}/goods/detail/:id`, jwt, goods.fetchDetail)
	// 修改详情
	.patch(`${prefix.api}/goods/detail/:id`, jwt, goods.update)

	// 拉取排行榜数据
	.get(`${prefix.api}/goods/ranking`, jwt, goods.fetchRankingList)
	// 更新排行榜
	.patch(`${prefix.api}/goods/ranking`, jwt, goods.updateRanking)

	// 拉取推荐榜数据
	.get(`${prefix.api}/goods/recom`, jwt, goods.fetchRecomList)
	// 更新推荐榜
	.patch(`${prefix.api}/goods/recom`, jwt, goods.updateRecom)

	// 创建产品规格
	.post(`${prefix.api}/goods/sku`, jwt, sku.create)
	// 获取规格列表
	.get(`${prefix.api}/goods/sku/list`, jwt, sku.fetchList)
	// 获取规格详情
	.get(`${prefix.api}/goods/sku/detail/:id`, jwt, sku.fetchDetail)
	// 修改规格详情
	.patch(`${prefix.api}/goods/sku/detail/:id`, jwt, sku.update)
	// 删除规格
	.delete(`${prefix.api}/goods/sku/detail/:id`, jwt, sku.remove)

	// 用户端获取首页推荐列表
	.get(`${prefix.app}/goods/recommend/list`, goods.appFetchRecommendList)
	// 用户端获取全部产品列表
	.get(`${prefix.app}/goods/list`, goods.appFetchList)
	// 用户端获取销量排行产品列表
	.get(`${prefix.app}/goods/top10/list`, goods.appFetchTop10List)
	// 用户端获取产品详情
	.get(`${prefix.app}/goods/detail/:id`, goods.appFetchDetail)
	// 用户端获取产品规格
	.get(`${prefix.app}/goods/sku/:id`, sku.appFetchSku)

module.exports = router