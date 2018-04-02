const Controller = require('egg').Controller;

class Shoppingcart extends Controller {
	
    /**
     * m.添加新商品到购物车
     */
    async m_append(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            
            await ctx.service.shoppingcart.append(uid, body)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.购物车内容
     */
    async m_list(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { couponId = 1, addressId } = ctx.query
            const data = await ctx.service.user.getById(uid)
            const shoppingcart = data.shoppingcart || []
            const address = data.addressList || []
            const coupon = data.couponList || []

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

                // 找sku的信息
                const sku = await ctx.service.sku.getById(d.skuId, false)
                const skuLock = await ctx.service.redis.getSkuLock(d.skuId)

                // 有商品的话更新
                if (sku) {
                    // 找商品信息
                    const goods = await ctx.service.goods.getById(sku.pid)
                    
                    // 找到商品信息
                    if (goods) {
                        // 更新商品信息
                        let stock = sku.stock - skuLock
                        if (stock < 0) {
                            stock = 0
                        }
                        d.stock = stock
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
                // 获取运费
                if (targetAddress) {
                    postage = await ctx.service.postage.getPriceByDistance(targetAddress.distance)
                }
            }

            // 找到可用的coupon
            let choosedCoupon
            let couponList = []
            if (couponId) {
                const now = new Date()
                let targetCoupon
                let bestCoupon
                
                // 找到可用的放到一个数组并按价值高的排序
                const lockedCoupon = await ctx.service.redis.getCouponLockListByUid(uid)
                couponList = coupon.filter(d => {
                    if (d.condition < totalPrice + postage && !d.used && !lockedCoupon.includes(d.id) && now < d.expiredTime) {
                        // 找到选中的那张
                        if (couponId === d.id) {
                            targetCoupon = d
                        }
                        return true
                    }
                    return false
                }).sort((a, b) => b.worth - a.worth)
                
                // 找到最好的那张
                bestCoupon = couponList[0]

                // 选中使用的
                choosedCoupon = targetCoupon ? targetCoupon : bestCoupon
            }

            return ctx.success({
                data: {
                    list: shoppingcart,
                    totalWeight,
                    totalPrice: totalPrice + postage - (choosedCoupon ? choosedCoupon.worth : 0),
                    postage,
                    choosedCoupon,
                    couponList
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
    async m_amount(ctx) {
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
    async m_update(ctx) {
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
}

module.exports = Shoppingcart