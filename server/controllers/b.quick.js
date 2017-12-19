var QuickModel = require('../models/quick')

class Control {
	
	/* 
	 * 创建快捷链接
	 *
	 * !@uri 图标地址
	 * !@index 排序
	 * !@link 链接
	 * !@name 名称
	 * @online 使用中
	 *
	 */
	static async save(ctx, next) {
		try {
			const { method } = ctx.request
			const { id } = ctx.params

			// 如果请求中有传id，更新，先查有没有这条数据
			if (id && method === 'PATCH') {
				const doc = await QuickModel.findOne({
					_id: id
				})

				if (!doc) {
					return ctx.error({
						msg: '该id不存在'
					})
				}
			}

			// 检查body的参数
			const body = ctx.request.body
			
			if (!body.name) {
				return ctx.error({
					msg: '名称不能为空'
				})
			}
			else if (!body.uri) {
				return ctx.error({
					msg: '图标地址不能为空'
				})
			}
			else if (!body.link) {
				return ctx.error({
					msg: '链接不能为空'
				})
			}
			else if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}
			
			// 有id，更新
			if (id && method === 'PATCH') {
				await QuickModel.update({
					_id: id
				}, body)
			}
			// 没有id，创建
			else {
				await new QuickModel(body).create()
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
			await QuickModel.remove({
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
			const count = await QuickModel.count({})
			
			// 查找数据
			let list = []
			if (count > 0) {
				list = await QuickModel.aggregate([
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

	// 获取分类详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const doc = await QuickModel.findOne({
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