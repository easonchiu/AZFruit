'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {

    /**
     * 获取商品列表
     */
    async list(ctx) {
        try {
            let { skip = 0, limit = 10 } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.goods.list(skip, limit)

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }
    
    /**
     * m.获取商品列表
     */
    async m_list(ctx) {
        try {
            let { category } = ctx.query

            const search = {}
            if (category) {
                search['category.id'] = category
            }

            const data = await ctx.service.goods.list(0, 99, search)

            return ctx.success({
                data: data.list
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 创建商品
     */
	async create(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.goods.create(body)

            return ctx.success()
		}
		catch (e) {
            return ctx.error(e)
		}
	}

    /**
     * 更新商品
     */
    async update(ctx) {
        try {
            const { id } = ctx.params
            const { body } = ctx.request

            await ctx.service.goods.update(id, body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 根据id获取商品
     */
	async detail(ctx) {
	    try {
	        const { id } = ctx.params
            const data = await ctx.service.goods.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.根据id获取商品
     */
    async m_detail(ctx) {
        try {
            const { id } = ctx.params
            const data = await ctx.service.goods.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }
    
    /**
     * 获取排行榜列表
     */
    async rankingList(ctx) {
        try {
            const data = await ctx.service.goods.rankingList(10)

            return ctx.success({
                data
            })
        }
        catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * m.获取排行榜列表
     */
    async m_rankingList(ctx) {
        try {
            const data = await ctx.service.goods.rankingList(10)

            return ctx.success({
                data
            })
        }
        catch(e) {
            return ctx.error(e)
        }
    }
    
    /**
     * 更新排行榜
     */
    async updateRanking(ctx) {
        try {
            const { id, ranking } = ctx.request.body

            await ctx.service.goods.updateRankingById(id, ranking)

            return ctx.success()
        }
        catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 获取推荐列表
     */
    async recomList(ctx) {
        try {
            const data = await ctx.service.goods.recomList(10)

            return ctx.success({
                data
            })
        }
        catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * m.获取推荐列表
     */
    async m_recomList(ctx) {
        try {
            const data = await ctx.service.goods.recomList(10)

            return ctx.success({
                data
            })
        }
        catch(e) {
            return ctx.error(e)
        }
    }
    
    /**
     * 更新推荐
     */
    async updateRecom(ctx) {
        try {
            const { id, recom } = ctx.request.body

            await ctx.service.goods.updateRecomById(id, recom)

            return ctx.success()
        } catch(e) {
            return ctx.error(e)
        }
    }

    
}

module.exports = GoodsController;
