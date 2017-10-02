var Banner = require('../models/banner')

class banner {
	
	/* 
	 * 创建banner
	 *
	 * !@uri 图片地址
	 * !@index 排序
	 * @link 图片点击的链接
	 * @desc 描述内容
	 * @online 上架中
	 *
	 */
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!body.uri) {
			return ctx.error({
				msg: '图片地址不能为空'
			})
		}

		if (!(/^[0-9]*$/g).test(body.index)) {
			return ctx.error({
				msg: '排序编号不能为空且必须为数字'
			})
		}
		
		try {
			const res = await Banner.findOne({
				uri: body.uri
			})

			if (res) {
				return ctx.error({
					code: 0,
					msg: '已存在相同地址的图片'
				})
			}

			await Banner.create({
				uri: body.uri,
				index: body.index,
				link: body.link,
				desc: body.desc,
				online: body.online,
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取banner列表
	static async fetchList(ctx, next) {
		try {
			const { skip = 0, limit = 10 } = ctx.query

			const count = await Banner.count({})
			let list = []

			if (count > 0) {
				list = await Banner.aggregate([{
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
						desc: 1,
						online: 1,
						createTime: 1,
						id: '$_id'
					}
				}, {
					$skip: +skip
				}, {
					$limit: +limit
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

	// 获取banner详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await Banner
				.findOne({_id: id}, {
					_id: 0,
					uri: 1,
					index: 1,
					link: 1,
					desc: 1,
					online: 1,
					createTime: 1,
				})

			return ctx.success({
				data: res
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 更新banner
	static async update(ctx, next) {

		const res = await Banner.create({
			
		})
		
		return ctx.body = res
	}

}

module.exports = banner