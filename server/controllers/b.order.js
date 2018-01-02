var OrderModel = require('../models/order')

class Control {

	// 获取订单列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10, type = 1 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 计算条目数量
			const count = await OrderModel.count({})
			
			// 查找数据
			let list = []
			if (count > 0) {
				list = await OrderModel.aggregate([
					{ $sort: { createTime: -1 } },
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
	
	// 获取订单详情
	static async fetchDetail(ctx, next) {
		try {
			const id = ctx.params.id
			
			// 查询相关的订单
			const res = await OrderModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})
			
			// 如果有找到，返回
			if (res) {
				return ctx.success({
					data: res
				})
			}
			else {
				return ctx.error({
					msg: '找不到相关订单'
				})
			}
		}
		catch (e) {
			return ctx.error()
		}
	}

}

module.exports = Control