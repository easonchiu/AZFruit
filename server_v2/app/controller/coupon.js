'use strict';

const Controller = require('egg').Controller;

class CouponController extends Controller {

    /**
     * 获取列表
     */
    async list(ctx) {
        try {
            let { skip = 0, limit = 10 } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.coupon.list(skip, limit)

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 详情
     */
    async detail(ctx) {
        try {
            const { id } = ctx.params
            const data = await ctx.service.coupon.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 更新
     */
    async update(ctx) {
        try {
            const { id } = ctx.params
            const { body } = ctx.request

            await ctx.service.coupon.update(id, body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 创建
     */
    async create(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.coupon.create(body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

}

module.exports = CouponController;
