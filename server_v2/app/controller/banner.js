'use strict';

const Controller = require('egg').Controller;

class BannerController extends Controller {

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
            return ctx.error()
        }
    }

	async save(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.banner.save(body)

            return ctx.success()
		}
		catch (e) {
            return ctx.error(e)
		}
	}

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

	async getById(ctx) {
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

    async deleteById(ctx) {
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
