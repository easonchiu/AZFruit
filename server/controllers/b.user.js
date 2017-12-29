var UserModel = require('../models/user')

class Control {
	// 获取用户列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 获取总用户数
			const count = await UserModel.count({})
			
			// 初始化用户列表
			let list = []
			
			// 如果有数据
			if (count > 0) {
				// 查找用户数据
				list = await UserModel.aggregate([
					{ $sort: { createTime: -1 } },
					{ $project: { _id: 0, id: '$_id', openId: 1, mobile: 1, integral: 1, createTime: 1 } },
					{ $skip: skip },
					{ $limit: limit }
				])
			}
			
			// 返回成功
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
	
	// 获取用户详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await UserModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})

			if (res) {
				return ctx.success({
					data: res
				})
			}
			else {
				return ctx.error({
					msg: '找不到相关的用户'
				})
			}
		}
		catch (e) {
			return ctx.error()
		}
		
	}

}

module.exports = Control