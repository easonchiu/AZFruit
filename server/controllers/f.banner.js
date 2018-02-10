var BannerService = require('../services/banner')

class Control {
	// 获取banner列表
	static async fetchList(ctx, next) {
		try {
			const cacheName = ctx.request.method + ctx.request.url
			const data = await BannerService.fetchOnlineList(cacheName)

			return ctx.success({
				data
			})
		} catch(e) {
			return ctx.error(e)
		}
	}
}

module.exports = Control