'use strict';

const Controller = require('egg').Controller;

class SkuController extends Controller {

    /**
     * 获取sku列表
     */
    async list(ctx) {
        try {
            let { skip = 0, limit = 10, pid } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.sku.list(skip, limit, {
                pid: pid
            })

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * m.获取sku列表
     */
    async m_list(ctx) {
        try {
            const { pid } = ctx.params

            const data = await ctx.service.sku.list(0, 99, {
                pid: pid
            })

            const list = data.list || []

            // 查找被占用的库存，并减去
            for (let i = 0; i < list.length; i++) {
                const lock = await ctx.service.redis.getSkuLock(list[i].id)
                list[i].stock -= lock
            }

            return ctx.success({
                data: list
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 创建sku
     */
	async create(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.sku.create(body)

            return ctx.success()
		}
		catch (e) {
            return ctx.error(e)
		}
	}

    /**
     * 更新sku
     */
    async update(ctx) {
        try {
            const { id } = ctx.params
            const { body } = ctx.request

            await ctx.service.sku.update(id, body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * sku详情
     */
	async detail(ctx) {
	    try {
	        const { id } = ctx.params
            const data = await ctx.service.sku.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 删除sku
     */
    async remove(ctx) {
        try {
            const { id } = ctx.params
            await ctx.service.sku.deleteById(id)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }
}

module.exports = SkuController;
