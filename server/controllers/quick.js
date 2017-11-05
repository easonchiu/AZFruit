var Quick = require('../models/quick')

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
	static async create(ctx, next) {
		const body = ctx.request.body
		
		if (!body.name) {
			return ctx.error({
				msg: '名称不能为空'
			})
		}

		if (!body.uri) {
			return ctx.error({
				msg: '图标地址不能为空'
			})
		}

		if (!body.link) {
			return ctx.error({
				msg: '链接不能为空'
			})
		}

		if (!(/^[0-9]*$/g).test(body.index)) {
			return ctx.error({
				msg: '排序编号不能为空且必须为数字'
			})
		}
		
		try {
			await Quick.create({
				uri: body.uri,
				index: body.index,
				link: body.link,
				name: body.name,
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
			
			let find = await Quick.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该id不存在'
				})
			}

			const body = ctx.request.body

			if (!body.name) {
				return ctx.error({
					msg: '名称不能为空'
				})
			}

			if (!body.uri) {
				return ctx.error({
					msg: '图标地址不能为空'
				})
			}

			if (!body.link) {
				return ctx.error({
					msg: '链接不能为空'
				})
			}

			if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}

			await Quick.update({
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
			await Quick.remove({
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

			const count = await Quick.count({})
			let list = []

			if (count > 0) {
				list = await Quick
					.aggregate([{
						$sort: {
							online: -1,
							index: 1
						}
					}, {
						$project: {
							_id: 0,
							uri: 1,
							index: 1,
							link: 1,
							name: 1,
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

	// 客户端获取列表
	static async appFetchList(ctx, next) {
		try {
			const list = await Quick
				.aggregate([{
					$match: {
						online: true
					}
				}, {
					$sort: {
						index: 1
					}
				}, {
					$project: {
						_id: 0,
						uri: 1,
						link: 1,
						name: 1,
					}
				}])

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

			const res = await Quick.findOne({
				_id: id
			})

			return ctx.success({
				data: {
					uri: res.uri,
					index: res.index,
					link: res.link,
					online: res.online,
					name: res.name,
					createTime: res.createTime,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	
}

module.exports = Control