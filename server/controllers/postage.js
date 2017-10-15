var Postage = require('../models/postage')

class control {
	
	/* 
	 * 创建运费
	 *
	 * !@km 超出距离
	 * !@weight 多少重量以内，单位：克
	 * !@postage 运费，单位：分
	 * @eachWeight 递增重量
	 * @eachPostage 每份重量加价
	 * @freePostage 满消费免运费
	 * @online 规则使用中
	 *
	 */
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!(/^[0-9]*$/g).test(body.km)) {
			return ctx.error({
				msg: '超出距离不能为空'
			})
		}

		if (!(/^[0-9]*$/g).test(body.weight)) {
			return ctx.error({
				msg: '重量不能为空'
			})
		}

		if (!(/^[0-9]*$/g).test(body.postage)) {
			return ctx.error({
				msg: '基础运费不能为空'
			})
		}
		
		try {
			await Postage.create({
				km: body.km,
				weight: body.weight,
				postage: body.postage,
				eachWeight: body.eachWeight,
				eachPostage: body.eachPostage,
				freePostage: body.freePostage,
				online: body.online,
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 更新运费
	static async update(ctx, next) {
		try {
			const { id } = ctx.params
			
			let find = await Postage.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该规则不存在'
				})
			}

			const body = ctx.request.body

			if (!(/^[0-9]*$/g).test(body.km)) {
				return ctx.error({
					msg: '超出距离不能为空'
				})
			}

			if (!(/^[0-9]*$/g).test(body.weight)) {
				return ctx.error({
					msg: '重量不能为空'
				})
			}

			if (!(/^[0-9]*$/g).test(body.postage)) {
				return ctx.error({
					msg: '基础运费不能为空'
				})
			}

			await Postage.update({
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
			await Postage.remove({
				_id: id
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取运费列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await Postage.count({})
			let list = []

			if (count > 0) {
				list = await Postage
					.aggregate([{
						$sort: {
							online: -1,
							km: 1
						}
					}, {
						$project: {
							_id: 0,
							km: 1,
							weight: 1,
							postage: 1,
							eachWeight: 1,
							eachPostage: 1,
							freePostage: 1,
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

	// 获取运费详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await Postage.findOne({
				_id: id
			})

			return ctx.success({
				data: {
					km: res.km,
					weight: res.weight,
					postage: res.postage,
					eachWeight: res.eachWeight,
					eachPostage: res.eachPostage,
					freePostage: res.freePostage,
					online: res.online,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	
}

module.exports = control