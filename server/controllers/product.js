var Product = require('../models/product')

class product {
	
	/* 
	 * 创建商品
	 *
	 * !@name 产品名称
	 * !@index 排序
	 * @desc 产品描述
	 * @isImport 是否进口
	 * @origin 产地
	 * @classes 所属分类
	 * @badge 标签
	 * @badgeColor 标签底色
	 * @imgs 产品轮播图
	 * @detail 详情
	 * @atIndex 首页推荐
	 * @online 上下架
	 *
	 */
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!body.name) {
			return ctx.error({
				msg: '商品名称不能为空'
			})
		}
		
		if (!(/^[0-9]*$/g).test(body.index)) {
			return ctx.error({
				msg: '排序编号不能为空且必须为数字'
			})
		}

		try {
			const res = await Product.create({
				name: body.name,
				index: body.index,
				desc: body.desc,
				isImport: body.isImport,
				origin: body.origin,
				classes: body.classes,
				badge: body.badge,
				badgeColor: body.badgeColor,
				imgs: body.imgs,
				detail: body.detail,
				atIndex: body.atIndex,
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

			const count = await Product.count({})
			let list = []

			if (count > 0) {
				list = await Product
					.aggregate([{
						$sort: {
							online: -1,
							index: 1,
						}
					}, {
						$project: {
							_id: 0,
							name: 1,
							index: 1,
							desc: 1,
							isImport: 1,
							origin: 1,
							classes: 1,
							badge: 1,
							badgeColor: 1,
							imgs: 1,
							detail: 1,
							atIndex: 1,
							online: 1,
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
	
	// 获取详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await Product.findOne({
				_id: id
			})

			return ctx.success({
				data: {
					name: res.name,
					index: res.index,
					desc: res.desc,
					isImport: res.isImport,
					origin: res.origin,
					classes: res.classes,
					badge: res.badge,
					badgeColor: res.badgeColor,
					imgs: res.imgs,
					detail: res.detail,
					atIndex: res.atIndex,
					online: res.online,
					createTime: res.createTime,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 修改产品
	static async update(ctx, next) {
		try {
			const { id } = ctx.params

			let find = await Product.findOne({
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
			
			if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}

			await Product.update({
				_id: id
			}, body)
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

}

module.exports = product