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

    /**
     * m.添加新商品到购物车
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
            const { couponId = 1, addressId } = ctx.query
            const data = await ctx.service.user.getById(uid)
            const shoppingcart = data.shoppingcart || []
            const address = data.addressList

            if (!shoppingcart.length) {
                return ctx.success({
                    data: {
                        list: []
                    }
                })
            }

            // 更新购物车，因为有可能库存会没有或产品会下架
            let totalWeight = 0
            let totalPrice = 0
            for (let i = 0; i < shoppingcart.length; i++) {
                const d = shoppingcart[i]

                // 从缓存中找sku的信息
                let sku = await ctx.service.redis.getSkuInfo(d.skuId)
                let goods = null
                
                // 如果没有，从数据库找
                if (!sku) {
                    sku = await ctx.service.sku.getById(d.skuId, false)
                }
                
                // 有商品的话更新
                if (sku) {
                    // 从缓存找商品信息
                    goods = await ctx.service.redis.getGoodsInfo(sku.pid)
                    
                    // 如果没有，从数据库找
                    if (!goods) {
                        goods = await ctx.service.goods.getById(sku.pid)
                    }
                    
                    // 找到商品信息
                    if (goods) {
                        // 更新商品信息
                        d.stock = sku.stock
                        d.weight = sku.weight
                        d.totalWeight = d.amount * sku.weight
                        d.online = sku.online
                        d.price = sku.price
                        d.totalPrice = d.amount * sku.price
                        d.unit = sku.unit
                        d.skuName = sku.desc
                        d.name = goods.name

                        // 计算购物车内商品的总重量与总费用
                        totalWeight += d.totalWeight
                        totalPrice += d.totalPrice
                    }
                    // 找不到商品信息，同样，删了
                    else {
                        shoppingcart.splice(i, 1)
                    }
                }
                // 如果找不到，就删了
                else {
                    shoppingcart.splice(i, 1)
                }
            }

            // 更新购物车
            await ctx.service.user.update(uid, {
                shoppingcart
            })

            // 找相关的地址
            let postage = 0
            if (addressId) {
                let targetAddress
                for (let i = 0; i < address.length; i++) {
                    if (addressId === address[i].id) {
                        targetAddress = address[i]
                    }
                }
                if (!targetAddress) {
                    return ctx.error('找不到相关的地址')
                }
                // 获取运费
                postage = await ctx.service.postage.getPriceByDistance(targetAddress.distance)
            }

            return ctx.success({
                data: {
                    list: shoppingcart,
                    totalWeight,
                    totalPrice: totalPrice + postage,
                    postage
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
     * m.更新购物车
     */
    async m_updateShoppingcart(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { amount, id } = ctx.request.body

            if (!amount) {
                return ctx.error('请输入正确的购买数量')
            }
            else if (amount > 9) {
                return ctx.error('一次最多可购买9件哦~')
            }
            else if (!id) {
                return ctx.error('商品id不能为空')
            }
            
            let needUpdate = false
            const userData = await ctx.service.user.getById(uid)
            const shoppingcart = userData.shoppingcart || []
            
            for (let i = 0; i < shoppingcart.length; i++) {
                const d = shoppingcart[i]
                // 先找到匹配中的商品
                if (d.skuId === id) {
                    if (amount <= d.stock && amount !== d.amount) {
                        d.amount = amount
                        needUpdate = true
                    }
                }
            }

            // 更新购物车
            if (needUpdate) {
                await ctx.service.user.update(uid, {
                    shoppingcart
                })
            }

            return ctx.success()

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
     * m.添加地址
     */
    async m_createAddress(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            await ctx.service.user.createAddress(uid, body, true)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.更新地址
     */
    async m_updateAddress(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            await ctx.service.user.createAddress(uid, body, false)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.删除地址
     */
    async m_removeAddress(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            await ctx.service.user.removeAddress(uid, body.id)

            return ctx.success()
        }
        catch (e) {
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
