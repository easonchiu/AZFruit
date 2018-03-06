'use strict';

const Controller = require('egg').Controller;

class BannerController extends Controller {

	async save(ctx) {
        try {
            const { body } = ctx.request
            if (ctx.method === 'PATCH' && body.id) {
                await ctx.service.banner.update(body)
                ctx.success()
            }
            else if (ctx.method === 'POST') {
                await ctx.service.banner.save(body)
                ctx.success()
            }
            else if (ctx.method === 'GET') {
                const data = await ctx.service.banner.get()
                ctx.success({
                    data
                })
            }
            else {
                ctx.error()
            }
		}
		catch (e) {
        	return ctx.error(e.message)
		}
	}
}

module.exports = BannerController;
