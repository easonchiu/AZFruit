var cache = require('memory-cache')
var BannerModel = require('../models/banner')

class Control {
	// 获取banner列表
	static async fetchList(ctx, next) {
		try {
			// 从缓存找数据
			const mc = cache.get(ctx.request.url)
			if (mc) {
				return ctx.success({
					data: mc
				})
			}

			const list = await BannerModel.aggregate([
				{ $match: { online: true } },
				{ $sort: { index: 1 } },
				{ $project: { _id: 0, __v: 0 } }
			])
			
			// 1分钟缓存
			cache.put(ctx.request.url, list, 1000 * 60)

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}
}

module.exports = Control