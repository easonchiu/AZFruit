var CategoryModel = require('../models/category')

class Control {
	
	// 获取列表
	static async fetchList(ctx, next) {
		try {
			const list = await CategoryModel.aggregate([
				{ $match: { online: true } },
				{ $sort: { index: 1 } },
				{ $project: { _id: 0, name: 1, badge: 1, badgeColor: 1, id: 1 } }
			])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
}

module.exports = Control