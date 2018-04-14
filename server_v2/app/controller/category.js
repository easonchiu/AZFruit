'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {

    /**
     * 创建
     */
    async create(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.category.create(body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 删除
     */
    async remove(ctx) {
        try {
            const { id } = ctx.params
            await ctx.service.category.deleteById(id)

            return ctx.success()
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

            await ctx.service.category.update(id, body)

            return ctx.success()
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
            let { skip = 0, limit = 10 } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.category.list(skip, limit)

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * m.获取列表
     */
    async m_list(ctx) {
        try {
            const data = await ctx.service.category.list(0, 99, {
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
     * 获取在线列表
     */
    async onlineList(ctx) {
        try {
            const data = await ctx.service.category.list(0, 99, {
                online: true
            })

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 详情
     */
    async detail(ctx) {
        try {
            const { id } = ctx.params
            const data = await ctx.service.category.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

}

module.exports = CategoryController;
