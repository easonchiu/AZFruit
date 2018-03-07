'use strict';

const Controller = require('egg').Controller;

class BannerController extends Controller {

	async save(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.banner.save(body)
            ctx.success()
		}
		catch (e) {
            return ctx.error(e)
		}
	}

    async update(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.banner.update(body)
            ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

	async getById(ctx) {
	    try {
	        const { id } = ctx.params
            const data = await ctx.service.banner.getById(id)
            ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    async deleteById(ctx) {
        try {
            const { id } = ctx.params
            const data = await ctx.service.banner.deleteById(id)
            ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }
}

module.exports = BannerController;
