'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

    /**
     * 获取用户列表
     */
    async list(ctx) {
        try {
            let { skip = 0, limit = 10 } = ctx.query
            skip = parseInt(skip)
            limit = parseInt(limit)

            const data = await ctx.service.user.list(skip, limit)

            return ctx.success({
                data
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

    /**
     * 用户详情
     */
	async detail(ctx) {
	    try {
	        const { id } = ctx.params
            const data = await ctx.service.user.getById(id)

            return ctx.success({
                data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }
    
    /**
     * m.用户登录
     */
    async m_login(ctx) {
        try {
            const { mobile, verifcode, smskey } = ctx.request.body

            await ctx.service.redis.checkSmsVerifcode(mobile, verifcode, smskey)

            // 获取用户信息
            let userData = await ctx.service.user.getByMobile(mobile)

            // 新用户
            if (true || !userData) {
                const id = await ctx.service.user.create(mobile, false)
                userData = {
                    openId: false,
                    id: id
                }

                // 找在线全部券
                let couponData = await ctx.service.coupon.list(0, 999, {
                    online: true
                })
                couponData = couponData.list || []

                // 发放优惠券，更新用户标识为有效用户
                await ctx.service.coupon.giveCouponsToUser(id, couponData)
            }

            // 验证通过，生成token给用户
            const token = await ctx.service.user.createToken(mobile, userData.id)

            return ctx.success({
                data: {
                    token,
                    hasOpenId: !!userData.openId
                }
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.用户获取验证码
     */
    async m_getVerifcode(ctx) {
        try {
            const { mobile } = ctx.request.body

            const data = await ctx.service.sms.sendVerifcode(mobile)

            return ctx.success({
                data: data
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.用户详情
     */
    async m_detail(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const data = await ctx.service.user.getById(uid)

            return ctx.success({
                data: {
                    mobile: data.mobile
                }
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

}

module.exports = UserController;
