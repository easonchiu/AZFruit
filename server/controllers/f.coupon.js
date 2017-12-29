var UserModel = require('../models/user')

class Control {

	// 用户获取列表
	static async fetchList(ctx, next) {
		try {
			const {uid} = ctx.state.jwt

			// 查找用户的地址表
			const doc = await UserModel.findOne({
				_id: uid
			}, 'couponList')
			
			// 如果没找到，返回空数据
			if (!doc) {
				return ctx.success({
					data: {
						list: []
					}
				})
			}
			
			// 找到，整理数据
			const couponList = doc.couponList.filter(res => {
				const now = new Date()
				// 如果在有效期内且没使用
				if (!res.used && now < res.expiredTime) {
					return true
				}
				return false
			})

			// 返回找到的结果
			ctx.success({
				data: {
					list: couponList
				}
			})
		}
		catch(e) {
			ctx.error()
		}
	}

}

module.exports = Control