var markdown = require('markdown').markdown
var GoodsModel = require('../models/goods')

class Control {
	
	/* 
	 * 保存商品
	 *
	 * !@name 产品名称
	 * !@index 排序
	 * @desc 产品描述
	 * @parameter[{name, value}] 产品参数
	 * @isImport 是否进口
	 * @origin 产地
	 * @category 所属分类
	 * @badge 标签
	 * @badgeColor 标签底色
	 * @imgs 产品轮播图
	 * @detail 详情
	 * @online 上下架
	 * @skuCount 有库存并上架中的规格数量，该值在规格操作时自动修改
	 *
	 */
	static async save(ctx, next) {
		try {
			const body = ctx.request.body
			const { method } = ctx.request
			const { id } = ctx.params

			// 如果请求中有传id，更新，先查有没有这条数据
			if (id && method === 'PATCH') {
				const doc = await GoodsModel.findOne({
					_id: id
				})

				if (!doc) {
					return ctx.error({
						msg: '该商品不存在'
					})
				}
			}

			// 检查body参数
			if (!body.name) {
				return ctx.error({
					msg: '商品名称不能为空'
				})
			}
			else if (!body.cover) {
				return ctx.error({
					msg: '商品封面图不能为空'
				})
			}
			else if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}

			// 有id，更新
			if (id && method === 'PATCH') {
				await GoodsModel.update({
					_id: id
				}, body)
			}
			// 没有id，创建
			else {
				await new GoodsModel(body).create()
			}
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
		
			// 计算条目数量
			const count = await GoodsModel.count({})

			// 查找数据
			let list = []
			if (count > 0) {
				list = await GoodsModel.aggregate([
					{ $sort: { online: -1, index: 1 } },
					{ $project: { _id: 0, __v: 0 } },
					{ $skip: skip },
					{ $limit: limit }
				])
			}

			return ctx.success({
				data: {
					list,
					count,
					skip,
					limit,
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 后台获取排行榜数据
	static async fetchRankingList(ctx, next) {
		try {
			const list = await GoodsModel.aggregate([
				{ $match: { online: true, skuCount: { '$gt': 0 } } },
				{ $sort: { ranking: -1 } },
				{ $project: { _id: 0, id: 1, name: 1, cover: 1, ranking: 1 } }
			])

			return ctx.success({
				data: list
			})
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 后台获取推荐榜数据
	static async fetchRecomList(ctx, next) {
		try {
			const list = await GoodsModel.aggregate([
				{ $match: { online: true, skuCount: { '$gt': 0 } } },
				{ $sort: { recom: -1 } },
				{ $project: { _id: 0, id: 1, name: 1, cover: 1, recom: 1 } }
			])

			return ctx.success({
				data: list
			})
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 后台更新排行榜
	static async updateRanking(ctx, next) {
		try {
			const body = ctx.request.body

			if (!body.id) {
				return ctx.error({
					msg: '商品id不能为空'
				})
			}

			if (body.ranking == undefined) {
				return ctx.error({
					msg: '商品排名不能为空'
				})
			}

			if (body.ranking < 0 || body.ranking > 9999) {
				return ctx.error({
					msg: '商品排名权重不能小于0或大于9999'
				})
			}

			const res = await GoodsModel.update({
				_id: body.id
			}, {
				ranking: body.ranking
			})

			if (res) {
				return ctx.success()
			}

			return ctx.error()
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 后台更新推荐榜
	static async updateRecom(ctx, next) {
		try {
			const body = ctx.request.body

			if (!body.id) {
				return ctx.error({
					msg: '商品id不能为空'
				})
			}

			if (body.recom < 0 || body.recom > 9999) {
				return ctx.error({
					msg: '商品推荐权重不能小于0或大于9999'
				})
			}

			const res = await GoodsModel.update({
				_id: body.id
			}, {
				recom: body.recom
			})

			if (res) {
				return ctx.success()
			}

			return ctx.error()
		}
		catch (e) {
			return ctx.error()
		}
	}
	
	// 获取详情
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