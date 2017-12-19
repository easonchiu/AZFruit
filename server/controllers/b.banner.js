var BannerModel = require('../models/banner')

class Control {
	
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
	static async save(ctx, next) {
		try {
			const { method } = ctx.request
			const { id } = ctx.params
			
			// 如果请求中有传id，更新，先查有没有这条数据
			if (id && method === 'PATCH') {
				const doc = await BannerModel.findOne({
					_id: id
				})

				if (!doc) {
					return ctx.error({
						msg: '该banner不存在'
					})
				}
			}

			// 检查body的参数
			const body = ctx.request.body

			if (!body.uri) {
				return ctx.error({
					msg: '图片地址不能为空'
				})
			}
			else if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}
		
			// 有id，更新
			if (id && method === 'PATCH') {
				await BannerModel.update({
					_id: id
				}, body)
			}
			// 没有id，创建
			else {
				await new BannerModel(body).create()
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
			await BannerModel.remove({
				_id: id
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取banner列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 计算条目数量
			const count = await BannerModel.count({})

			// 查找数据
			let list = []
			if (count > 0) {
				list = await BannerModel.aggregate([
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

	// 获取banner详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const doc = await BannerModel.findOne({
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