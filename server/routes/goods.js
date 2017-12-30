var router = require('koa-router')()
var prefix = require('../conf/prefix')
var f_goods = require('../controllers/f.goods')
var b_goods = require('../controllers/b.goods')
var f_sku = require('../controllers/f.sku')
var b_sku = require('../controllers/b.sku')
var jwt = require('../middlewares/jwt')

router
	// 创建产品
	.post(`${prefix.api}/goods`, jwt, b_goods.save)
	// 获取列表
	.get(`${prefix.api}/goods/list`, jwt, b_goods.fetchList)
	// 获取详情
	.get(`${prefix.api}/goods/detail/:id`, jwt, b_goods.fetchDetail)
	// 修改详情
	.patch(`${prefix.api}/goods/detail/:id`, jwt, b_goods.save)

	// 拉取排行榜数据
	.get(`${prefix.api}/goods/ranking`, jwt, b_goods.fetchRankingList)
	// 更新排行榜
	.patch(`${prefix.api}/goods/ranking`, jwt, b_goods.updateRanking)

	// 拉取推荐榜数据
	.get(`${prefix.api}/goods/recom`, jwt, b_goods.fetchRecomList)
	// 更新推荐榜
	.patch(`${prefix.api}/goods/recom`, jwt, b_goods.updateRecom)

	// 创建产品规格
	.post(`${prefix.api}/goods/sku`, jwt, b_sku.save)
	// 获取规格列表
	.get(`${prefix.api}/goods/sku/list`, jwt, b_sku.fetchList)
	// 获取规格详情
	.get(`${prefix.api}/goods/sku/detail/:id`, jwt, b_sku.fetchDetail)
	// 修改规格详情
	.patch(`${prefix.api}/goods/sku/detail/:id`, jwt, b_sku.save)
	// 删除规格
	.delete(`${prefix.api}/goods/sku/detail/:id`, jwt, b_sku.remove)

	// 用户端获取首页推荐列表
	.get(`${prefix.app}/goods/recommend`, f_goods.fetchRecommendList)
	// 用户端获取销量排行产品列表
	.get(`${prefix.app}/goods/ranking`, f_goods.fetchRankingList)
	// 用户端获取全部产品列表
	.get(`${prefix.app}/goods`, f_goods.fetchList)
	// 用户端获取产品详情
	.get(`${prefix.app}/goods/:id`, f_goods.fetchDetail)
	// 用户端获取产品规格列表
	.get(`${prefix.app}/goods/:id/sku`, f_sku.fetchList)

module.exports = router