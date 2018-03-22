'use strict';

const Controller = require('egg').Controller;

class PostageController extends Controller {

    /**
     * 获取运费列表
     */
    async list(ctx) {
        try {
            let { skip = 0, limit = 10 } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.postage.list(skip, limit)

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 创建运费
     */
	async create(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.postage.create(body)

            return ctx.success()
		}
		catch (e) {
            return ctx.error(e)
		}
	}

    /**
     * 更新运费
     */
    async update(ctx) {
        try {
            const { id } = ctx.params
            const { body } = ctx.request

            await ctx.service.postage.update(id, body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 获取运费详情
     */
	async detail(ctx) {
	    try {
	        const { id } = ctx.params
            const data = await ctx.service.postage.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 删除运费
     */
    async remove(ctx) {
        try {
            const { id } = ctx.params
            await ctx.service.postage.deleteById(id)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }
}

module.exports = PostageController;
