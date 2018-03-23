'use strict';

const Controller = require('egg').Controller;

class QuickController extends Controller {

    /**
     * 创建
     */
    async create(ctx) {
        try {
            const { body } = ctx.request
            const res = await ctx.service.upload.create(body)

            return ctx.success({
                data: res
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 获取列表
     */
    async list(ctx) {
        try {
            let { skip = 0, limit = 10, classes } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.upload.list(skip, limit, classes)

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

}

module.exports = QuickController;
