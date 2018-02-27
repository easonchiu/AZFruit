'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index(ctx) {
		try {
			const v = await ctx.service.home.test2(20)

			ctx.success({
				data: v
			})
		}
		catch (e) {
			ctx.error()
		}
	}
}

module.exports = HomeController;
