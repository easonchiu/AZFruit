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
     * m.获取banner列表
     */
    async m_list(ctx) {
        try {

            const data = await ctx.service.banner.list(0, 99, {
                online: true
            })

            return ctx.success({
                data: data.list
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
     * banner详情
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
     * 删除banner
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
