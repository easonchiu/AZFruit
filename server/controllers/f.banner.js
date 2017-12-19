var BannerModel = require('../models/banner')

class Control {
	// 获取banner列表
	static async fetchList(ctx, next) {
		try {
			const list = await BannerModel.aggregate([
				{ $match: { online: true } },
				{ $sort: { index: 1 } },
				{ $project: { _id: 0, __v: 0 } }
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