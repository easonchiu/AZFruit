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
			await BannerModel.create({
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

			const count = await BannerModel.count({})
			let list = []

			if (count > 0) {
				//list = await BannerModel.test()

				//console.log('finally', list)
				
				list = await BannerModel
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
							desc: 1,
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
			console.log(e)
			return ctx.error()
		}
	}

	// 获取banner详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await BannerModel.findOne({
				_id: id
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
		try {
			const { id } = ctx.params
			
			let find = await BannerModel.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该banner不存在'
				})
			}

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

			await BannerModel.update({
				_id: id
			}, body)

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 前端获取banner列表
	static async appFetchList(ctx, next) {
		try {
			const list = await BannerModel
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
						index: 1,
						link: 1,
					}
				}])


			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}
}

module.exports = Control