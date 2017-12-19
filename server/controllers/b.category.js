var CategoryModel = require('../models/category')

class Control {
	
	/* 
	 * 创建分类
	 *
	 * !@name 图标地址
	 * !@index 排序
	 * @badge 标签
	 * @badgeColor 标签色
	 * @online 使用中
	 *
	 */
	static async save(ctx, next) {
		try {
			const { method } = ctx.request
			const { id } = ctx.params

			// 如果请求中有传id，更新，先查有没有这条数据
			if (id && method === 'PATCH') {
				const doc = await CategoryModel.findOne({
					_id: id
				})

				if (!doc) {
					return ctx.error({
						msg: '该分类不存在'
					})
				}
			}

			// 检查body的参数
			const body = ctx.request.body

			if (!body.name) {
				return ctx.error({
					msg: '分类名不能为空'
				})
			}
			else if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}
			
			// 有id，更新
			if (id && method === 'PATCH') {
				await CategoryModel.update({
					_id: id
				}, body)
			}
			// 没有id，创建
			else {
				await new CategoryModel(body).create()
			}

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 删除
	static async remove(ctx, next) {
		try {
			const { id } = ctx.params
			await CategoryModel.remove({
				_id: id
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取分类列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 计算条目数量
			const count = await CategoryModel.count({})

			// 查找数据
			let list = []
			if (count > 0) {
				list = await CategoryModel.aggregate([
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

	// 获取使用中的分类列表
	static async fetchOnlineList(ctx, next) {
		try {

			// 查找数据
			const list = await CategoryModel.aggregate([
				{ $match: { online: true } },
				{ $sort: { index: 1 } },
				{ $project: { _id: 0, name: 1, id: 1 } }
			])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 获取分类详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const doc = await CategoryModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})

			return ctx.success({
				data: doc
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	
}

module.exports = Control