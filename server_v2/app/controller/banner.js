'use strict';

const Controller = require('egg').Controller;

class BannerController extends Controller {

    /**
     * 获取banner列表
     */
    async list(ctx) {
        try {
            let { skip = 0, limit = 10 } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.banner.list(skip, limit)

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 创建banner
     */
	async create(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.banner.create(body)

            return ctx.success()
		}
		catch (e) {
            return ctx.error(e)
		}
	}

    /**
     * 更新banner
     */
    async update(ctx) {
        try {
            const { id } = ctx.params
            const { body } = ctx.request

            await ctx.service.banner.update(id, body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 根据id获取banner
     */
	async detail(ctx) {
	    try {
	        const { id } = ctx.params
            const data = await ctx.service.banner.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 根据id删除banner
     */
    async remove(ctx) {
        try {
            const { id } = ctx.params
            await ctx.service.banner.deleteById(id)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }
}

module.exports = BannerController;
