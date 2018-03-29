'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {

    /**
     * 获取订单列表
     */
    async list(ctx) {
        try {
            // type: 1 等待处理的, 2 历史订单, 3 已发货的, 4 其他订单，就是已发货之后的状态的，以及关闭的订单
            let { skip = 0, limit = 10, type = 1 } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)
            type = parseInt(type)

            const data = await ctx.service.order.list(skip, limit, type)

            return ctx.success({
                data
            })
        }
        catch(e) {
            return ctx.error(e)
        }
    }
    
    /**
     * 创建订单
     */
    async m_create(ctx) {
        try {
            const { body } = ctx.request
            await ctx.service.order.create(body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }
    
    /**
     * 获取订单数量（待支付）
     */
    async m_amount(ctx) {
        try {

            return ctx.success({
                data: {
                    amount: 0
                }
            })
        }
        catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 更新订单状态
     */
    async updateStatus(ctx) {
        try {
            const { orderNo } = ctx.params
            const { body } = ctx.request

            await ctx.service.order.updateStatus(orderNo, body)
            
            // 如果是关闭订单，还需要返还用户的coupon
            if (body.status === 90) {
                console.log('controller.order.updateStatus')
            }

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 订单详情
     */
	async detail(ctx) {
	    try {
	        const { orderNo } = ctx.params
            const data = await ctx.service.order.getByOrderNo(orderNo)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }
}

module.exports = OrderController;
