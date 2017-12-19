var PostageModel = require('../models/postage')

class Control {
	
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
	static async save(ctx, next) {
		try {
			const { method } = ctx.request
			const { id } = ctx.params

			// 如果请求中有传id，更新，先查有没有这条数据
			if (id && method === 'PATCH') {
				const doc = await PostageModel.findOne({
					_id: id
				})

				if (!doc) {
					return ctx.error({
						msg: '该规则不存在'
					})
				}
			}

			// 检查body的参数
			const body = ctx.request.body

			if (!(/^[0-9]*$/g).test(body.km)) {
				return ctx.error({
					msg: '超出距离不能为空'
				})
			}
			else if (!(/^[0-9]*$/g).test(body.weight)) {
				return ctx.error({
					msg: '重量不能为空'
				})
			}
			else if (!(/^[0-9]*$/g).test(body.postage)) {
				return ctx.error({
					msg: '基础运费不能为空'
				})
			}

			// 有id，更新
			if (id && method === 'PATCH') {
				await PostageModel.update({
					_id: id
				}, body)
			}
			// 没有id，创建
			else {
				await new PostageModel(body).create()
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
			await PostageModel.remove({
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
			
			// 计算条目数量
			const count = await PostageModel.count({})
			
			// 查找数据
			let list = []
			if (count > 0) {
				list = await PostageModel.aggregate([
					{ $sort: { online: -1, km: 1 } },
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

	// 获取运费详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const doc = await PostageModel.findOne({
				_id: id
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