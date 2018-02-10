var BannerService = require('../services/banner')

class Control {
	
	/* 
	 * 创建banner
	 *
	 * !@uri 图片地址
	 * !@index 排序
	 * @link 图片点击的链接
	 * @desc 描述内容
	 * @online 上架中
	 *
	 */
	static async save(ctx, next) {
		try {
			const { method, body } = ctx.request
			const { id } = ctx.params
			
			await BannerService.save(id, body, method)
			
			return ctx.success()
		} catch(e) {
			return ctx.error(e)
		}
	}

	// 删除
	static async remove(ctx, next) {
		try {
			const { id } = ctx.params
			
			await BannerService.removeById(id)
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取banner列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			const data = await BannerService.fetchList(skip, limit)

			return ctx.success({
				data
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 获取banner详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const doc = await BannerService.findById(id)

			return ctx.success({
				data: doc
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
}

module.exports = Control