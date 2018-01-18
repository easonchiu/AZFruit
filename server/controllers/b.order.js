var OrderModel = require('../models/order')

class Control {

	// 获取订单列表
	static async fetchList(ctx, next) {
		try {
			// type: 1 等待处理的，2 历史订单
			let { skip = 0, limit = 10, type = 1 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 计算条目数量
			let count = 0
			if (type == 1) {
				// 只查找已经支付的，待支付的无视
				count = await OrderModel.count({
					status: 11
				})
			}
			else {
				count = await OrderModel.history.count({})
			}
			
			// 查找数据
			let list = []
			if (count > 0) {
				if (type == 1) {
					list = await OrderModel.aggregate([
						{ $match: { status: 11 } },
						{ $sort: { createTime: -1 } },
						{ $project: { _id: 0, __v: 0 } },
						{ $skip: skip },
						{ $limit: limit }
					])
				}
				else {
					list = await OrderModel.history.aggregate([
						{ $sort: { createTime: -1 } },
						{ $project: { _id: 0, __v: 0 } },
						{ $skip: skip },
						{ $limit: limit }
					])
				}
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
			let res = await OrderModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})
			
			// 如果在order表中找不到，再去history表中找找，history表更多，所以找不到再找它
			if (!res) {
				res = await OrderModel.history.findOne({
					_id: id
				}, {
					_id: 0,
					__v: 0
				})
			}
			
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