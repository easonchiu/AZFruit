var QuickModel = require('../models/quick')

class Control {

	// 获取列表
	static async fetchList(ctx, next) {
		try {
			const list = await QuickModel.aggregate([
				{ $match: { online: true } },
				{ $sort: { index: 1 } },
				{ $project: { _id: 0, link: 1, uri: 1, name: 1 } }
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