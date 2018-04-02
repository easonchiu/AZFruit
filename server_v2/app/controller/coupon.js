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
            body.worth *= 100
            await ctx.service.coupon.create(body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.获取优惠券列表
     */
    async m_list(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            let { flag = 1 } = ctx.query
            flag = parseInt(flag)

            const data = await ctx.service.user.getById(uid)
            let couponList = data.couponList || []

            // 过滤
            const lockedCoupon = await ctx.service.redis.getCouponLockListByUid(uid)
            const now = new Date()
            couponList = couponList.filter(res => {
                // 已锁定或已经过期的不返回
                if (lockedCoupon.includes(res.id) || now > res.expiredTime) {
                    return false
                }
                
                // 过滤状态
                if (!res.used && flag === 1) {
                    return true
                }
                else if (res.used && flag !== 1) {
                    return true
                }
            })

            return ctx.success({
                data: {
                    list: couponList
                }
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

}

module.exports = CouponController;
