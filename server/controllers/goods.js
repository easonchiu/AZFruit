var markdown = require('markdown').markdown
var GoodsModel = require('../models/goods')

class Control {
	
	/* 
	 * 创建商品
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
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!body.name) {
			return ctx.error({
				msg: '商品名称不能为空'
			})
		}

		if (!body.cover) {
			return ctx.error({
				msg: '商品封面图不能为空'
			})
		}
		
		if (!(/^[0-9]*$/g).test(body.index)) {
			return ctx.error({
				msg: '排序编号不能为空且必须为数字'
			})
		}

		try {
			const res = await GoodsModel.create({
				name: body.name,
				cover: body.cover,
				index: body.index,
				desc: body.desc,
				parameter: body.parameter,
				isImport: body.isImport,
				origin: body.origin,
				category: body.category,
				badge: body.badge,
				badgeColor: body.badgeColor,
				imgs: body.imgs,
				detail: body.detail,
				online: body.online,
			})

			if (res) {
				return ctx.success()
			} else {
				return ctx.error()
			}

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

			const count = await GoodsModel.count({})
			let list = []

			if (count > 0) {
				list = await GoodsModel
					.aggregate([{
						$sort: {
							online: -1,
							index: 1,
						}
					}, {
						$project: {
							_id: 0,
							name: 1,
							cover: 1,
							index: 1,
							desc: 1,
							isImport: 1,
							origin: 1,
							category: {
								id: 1,
								name: 1,
							},
							badge: 1,
							badgeColor: 1,
							imgs: 1,
							detail: 1,
							recom: 1,
							recomIndex: 1,
							ranking: 1,
							rankingVal: 1,
							online: 1,
							skuCount: 1,
							id: '$_id'
						}
					}, {
						$skip: skip
					}, {
						$limit: limit
					}])
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
			const list = await GoodsModel
				.aggregate([{
					$match: {
						online: true,
						skuCount: {
							'$gt': 0
						}
					}
				}, {
					$sort: {
						ranking: -1,
					}
				}, {
					$project: {
						_id: 0,
						name: 1,
						cover: 1,
						ranking: 1,
						id: '$_id'
					}
				}])

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
			const list = await GoodsModel
				.aggregate([{
					$match: {
						online: true,
						skuCount: {
							'$gt': 0
						}
					}
				}, {
					$sort: {
						recom: -1,
					}
				}, {
					$project: {
						_id: 0,
						name: 1,
						cover: 1,
						recom: 1,
						id: '$_id'
					}
				}])

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

	// 用户获取首页推荐列表
	static async appFetchRecommendList(ctx, next) {
		try {
			const list = await GoodsModel
				.aggregate([{
					$match: {
						online: true,
						atIndex: true,
						skuCount: {
							'$gt': 0
						}
					}
				}, {
					$sort: {
						index: 1,
					}
				}, {
					$project: {
						_id: 0,
						name: 1,
						cover: 1,
						desc: 1,
						isImport: 1,
						origin: 1,
						badge: 1,
						price: 1,
						prePrice: 1,
						unit: 1,
						badgeColor: 1,
						sellCount: 1,
						id: '$_id'
					}
				}])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 用户获取全部列表
	static async appFetchList(ctx, next) {
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
			const list = await GoodsModel
				.aggregate([{
					$match: match
				}, {
					$sort: {
						index: 1,
					}
				}, {
					$project: {
						_id: 0,
						name: 1,
						cover: 1,
						desc: 1,
						isImport: 1,
						origin: 1,
						badge: 1,
						price: 1,
						prePrice: 1,
						unit: 1,
						badgeColor: 1,
						sellCount: 1,
						id: '$_id'
					}
				}])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 用户获取top10列表
	static async appFetchTop10List(ctx, next) {
		try {
			const list = await GoodsModel
				.aggregate([{
					$match: {
						online: true,
						skuCount: {
							'$gt': 0
						}
					}
				}, {
					$sort: {
						sellCount: -1,
					}
				}, {
					$project: {
						_id: 0,
						name: 1,
						cover: 1,
						desc: 1,
						isImport: 1,
						origin: 1,
						badge: 1,
						price: 1,
						prePrice: 1,
						unit: 1,
						badgeColor: 1,
						sellCount: 1,
						id: '$_id'
					}
				}, {
					$limit: 10
				}])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await GoodsModel.findOne({
				_id: id
			})
			
			if (res) {
				return ctx.success({
					data: {
						name: res.name,
						cover: res.cover,
						index: res.index,
						desc: res.desc,
						parameter: res.parameter,
						isImport: res.isImport,
						origin: res.origin,
						category: res.category,
						badge: res.badge,
						badgeColor: res.badgeColor,
						imgs: res.imgs,
						detail: res.detail,
						atIndex: res.atIndex,
						online: res.online,
						skuCount: res.skuCount,
						createTime: res.createTime,
						id: id
					}
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

	// 用户获取产品详情
	static async appFetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await GoodsModel.findOne({
				_id: id
			})
			
			if (res) {
				const detail = markdown.toHTML(res.detail)
				return ctx.success({
					data: {
						name: res.name,
						cover: res.cover,
						desc: res.desc,
						parameter: res.parameter,
						isImport: res.isImport,
						origin: res.origin,
						badge: res.badge,
						badgeColor: res.badgeColor,
						imgs: res.imgs,
						detail: detail,
						price: res.price,
						prePrice: res.prePrice,
						unit: res.unit,
						parameter: res.parameter,
						online: res.online,
						skuCount: res.skuCount,
						id: id
					}
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
	
	// 修改产品
	static async update(ctx, next) {
		try {
			const { id } = ctx.params

			let find = await GoodsModel.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该产品不存在'
				})
			}

			const body = ctx.request.body

			if (!body.name) {
				return ctx.error({
					msg: '商品名称不能为空'
				})
			}

			if (!body.cover) {
				return ctx.error({
					msg: '商品封面图不能为空'
				})
			}
			
			if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}

			await GoodsModel.update({
				_id: id
			}, body)
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

}

module.exports = Control