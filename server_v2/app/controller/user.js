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
            if (!userData) {
                const id = await ctx.service.user.create(mobile, false)
                userData = {
                    openId: false,
                    id: id
                }
                // 发优惠券

                // 更新用户标识为有效用户
                await ctx.service.user.update(id, {
                    valid: true
                })
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

    /**
     * m.购物车内容
     */
    async m_addToShoppingcart(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            
            await ctx.service.user.addToShoppingCartById(uid, body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }
    
    /**
     * m.购物车内容
     */
    async m_shoppingcart(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const data = await ctx.service.user.getById(uid)
            const shoppingcart = data.shoppingcart || []

            if (!shoppingcart.length) {
                return ctx.error('购物车是空的哦~')
            }

            // 更新购物车，因为有可能库存会没有或产品会下架
            let needUpdate = false
            for (let i = 0; i < shoppingcart.length; i++) {
                const d = shoppingcart[i]
                const stock = await ctx.service.redis.getSkuStock(d.skuId)
                // 如果命中缓存
                if (stock) {
                    // 库存匹配
                    if (stock !== d.stock) {
                        d.stock = stock
                        needUpdate = true
                    }
                }
                // 没命中缓存，从数据库查
                else {
                    const sku = await ctx.service.sku.getById(d.skuId, false)
                    if (!sku) {
                        d.stock = 0
                        needUpdate = true
                    }
                    // 库存匹配
                    else if (sku.stock !== d.stock) {
                        d.stock = sku.stock
                        needUpdate = true
                    }
                }
            }

            // 需要更新购物车
            if (needUpdate) {
                await ctx.service.user.update(uid, {
                    shoppingcart
                })
            }

            return ctx.success({
                data: {
                    list: shoppingcart
                }
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.购物车数量
     */
    async m_shoppingcartAmount(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const data = await ctx.service.user.getById(uid)
            const shoppingcart = data.shoppingcart || []

            return ctx.success({
                data: {
                    amount: shoppingcart.length
                }
            })
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.获取优惠券列表
     */
    async m_couponList(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            let { flag = 1 } = ctx.query
            flag = parseInt(flag)

            const data = await ctx.service.user.getById(uid)
            let couponList = data.couponList || []

            // 过滤
            couponList = couponList.filter(res => {
                // 已使用的不返回
                if (res.locked) {
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

    /**
     * m.获取地址列表
     */
    async m_addressList(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const data = await ctx.service.user.getById(uid)
            let addressList = data.addressList || []

            return ctx.success({
                data: {
                    list: addressList,
                    default: data.defaultAddress
                }
            })
        } catch(e) {
            return ctx.error(e)
        }
    }
    
    /**
     * m.获取地址详情
     */
    async m_addressDetail(ctx) {
        try {
            const { id } = ctx.params
            const { uid } = ctx.jwt || {}
            const isDefault = id === 'default' // 如果id为default，表示默认地址

            const data = await ctx.service.user.getById(uid)
            let addressList = data.addressList || []

            let address = {}
            if (id) {
                addressList.forEach(res => {
                    if (isDefault) {
                        if (res.id === data.defaultAddress) {
                            address = res
                        }
                    }
                    else if (res.id === id) {
                        address = res
                    }
                })
            }
            
            return ctx.success({
                data: address
            })
        } catch(e) {
            return ctx.error(e)
        }
    }

}

module.exports = UserController;
