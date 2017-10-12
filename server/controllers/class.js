var Class = require('../models/class')

class control {
	
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
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!body.name) {
			return ctx.error({
				msg: '分类名不能为空'
			})
		}

		if (!(/^[0-9]*$/g).test(body.index)) {
			return ctx.error({
				msg: '排序编号不能为空且必须为数字'
			})
		}
		
		try {
			await Class.create({
				name: body.name,
				index: body.index,
				badge: body.badge,
				badgeColor: body.badgeColor,
				online: body.online,
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 更新分类
	static async update(ctx, next) {
		try {
			const { id } = ctx.params
			
			let find = await Class.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该分类不存在'
				})
			}

			const body = ctx.request.body

			if (!body.name) {
				return ctx.error({
					msg: '分类名不能为空'
				})
			}

			if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}

			await Class.update({
				_id: id
			}, body)

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 删除
	static async remove(ctx, next) {
		try {
			const { id } = ctx.params
			await Class.remove({
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

			const count = await Class.count({})
			let list = []

			if (count > 0) {
				list = await Class
					.aggregate([{
						$sort: {
							online: -1,
							index: 1
						}
					}, {
						$project: {
							_id: 0,
							name: 1,
							index: 1,
							badge: 1,
							badgeColor: 1,
							online: 1,
							createTime: 1,
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

	// 获取分类详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await Class.findOne({
				_id: id
			})

			return ctx.success({
				data: {
					name: res.name,
					index: res.index,
					online: res.online,
					badge: res.badge,
					badgeColor: res.badgeColor,
					createTime: res.createTime,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	
}

module.exports = control