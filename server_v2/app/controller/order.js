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
            const { uid } = ctx.jwt || {}
            
            // 生成预支付订单
            const orderNo = await ctx.service.order.create(uid, body)
            
            // 清空购物车
            await ctx.service.shoppingcart.clear(uid)
            
            // 如果有优惠券，锁定它
            if (body.couponId) {
                await ctx.service.coupon.lockByUid(uid, body.couponId)
            }

            return ctx.success({
                data: {
                    orderNo
                }
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }
    
    /**
     * 删除订单
     */
    async m_remove(ctx) {
        try {
            const orderNo = ctx.params.orderNo
            const { uid } = ctx.jwt || {}

            // 删除缓存订单
            const res = await ctx.service.redis.deletePreOrderByUid(orderNo, uid)

            if (res) {
                return ctx.success()
            }
            else {
                return ctx.error('无法删除该订单')
            }
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 获取列表
     */
    async m_list(ctx) {
        try {
            let { type = 1 } = ctx.request.query
            const { uid } = ctx.jwt || {}

            // type: 1. 全部预支付订单 + 进行中的订单，2. 完成后的订单
            type = parseInt(type)
            
            // 查找
            let list = []

            if (type === 1) {
                list = await ctx.service.redis.getPreOrderListByUid(uid)
            }
            
            return ctx.success({
                data: {
                    list,
                    amount: list.length
                }
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * 获取列表详情
     */
    async m_detail(ctx) {
        try {
            const orderNo = ctx.params.orderNo
            const { uid } = ctx.jwt || {}

            // 先从缓存数据库查找，如果找不到再去正式库找
            let res = await ctx.service.redis.getPreOrderDetailByUid(orderNo, uid)

            // 去正式库找
            if (!res) {

            }

            return ctx.success({
                data: res
            })
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
            const { uid } = ctx.jwt || {}

            const amount = await ctx.service.redis.getPreOrderAmount(uid)

            return ctx.success({
                data: {
                    amount
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
