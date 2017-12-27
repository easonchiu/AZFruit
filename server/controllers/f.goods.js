var cache = require('memory-cache')
var markdown = require('markdown').markdown
var GoodsModel = require('../models/goods')

class Control {

	// 用户获取首页推荐列表
	static async fetchRecommendList(ctx, next) {
		try {
			const list = await GoodsModel.aggregate([
				{ $match: { online: true, skuCount: { '$gt': 0 } } },
				{ $sort: { recom: -1 } },
				{ $project: { _id: 0, __v: 0, category: 0, imgs: 0, parameter: 0 } }
			])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 用户获取全部列表
	static async fetchList(ctx, next) {
		const match = {
			online: true,
			skuCount: {
				'$gt': 0
			}
		}
		
		// 如果需要按分类查询
		if (ctx.query.category) {
			match['category.id'] = ctx.query.category
		}

		try {
			const list = await GoodsModel.aggregate([
				{ $match: match },
				{ $sort: { index: 1 } },
				{ $project: { _id: 0, __v: 0, category: 0, imgs: 0, parameter: 0 } }
			])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 用户获取top10列表
	static async fetchRankingList(ctx, next) {
		try {
			const list = await GoodsModel.aggregate([
				{ $match: { online: true, skuCount: { '$gt': 0 } } },
				{ $sort: { ranking: -1 } },
				{ $project: { _id: 0, __v: 0, category: 0, imgs: 0, parameter: 0 } },
				{ $limit: 10 }
			])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 用户获取产品详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await GoodsModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})
			
			if (res) {
				const detail = markdown.toHTML(res.detail)
				res.detail = detail
				return ctx.success({
					data: res
				})
			}
			else {
				return ctx.error({
					msg: '找不到该商品'
				})
			}
		} catch(e) {
			return ctx.error()
		}
	}

}

module.exports = Control