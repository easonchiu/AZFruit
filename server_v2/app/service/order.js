const Service = require('egg').Service;

class order extends Service {
    
    /**
     * 创建订单
     */
    async create(uid, data) {
        const th = this
        const ctx = th.ctx
        return new Promise(async function(resolve, reject) {
            try {
                const addressId = data.addressId
                const couponId = data.couponId
                const now = new Date()
                
                if (!uid) {
                    return reject('用户信息不正确')
                }
                else if (!addressId) {
                    return reject('地址不能为空')
                }
                
                const userData = await ctx.service.user.getById(uid)
                
                // 找到用户的选中地址
                const address = userData.addressList.find(res => res.id === addressId)

                if (!address) {
                    return reject('找不到相关的地址信息')
                }

                // 找到用户的选中优惠券
                const coupon = couponId && userData.couponList.find(res => res.id === couponId)

                // 验证优惠券状态
                if (coupon) {
                    if (coupon.used || coupon.locked || now > coupon.expiredTime) {
                        return reject('该优惠券不可用')
                    }
                }

                // 获取购物车内容
                const shoppingcart = userData.shoppingcart || []

                if (!shoppingcart.length) {
                    return reject('购物车是空的哦~')
                }

                // 判断购物车内的商品库存
                for (let i = 0; i < shoppingcart.length; i++) {
                    const d = shoppingcart[i]
                    
                    const sku = await ctx.service.sku.getById(d.skuId, false)
                    const skuLock = await ctx.service.redis.getSkuLock(d.skuId)

                    if (!sku) {
                        return reject(`商品【${d.name}-${d.skuName}】已下架`)
                    }
                    // 判断库存
                    else if (sku.stock < d.stock - skuLock) {
                        return reject(`商品【${d.name}-${d.skuName}】库存不足`)
                    }
                }
                
                // 通过判定之后，计算总费用这些
                const postage = await ctx.service.postage.getPriceByDistance(address.distance)
                let totalWeight = 0
                let totalPrice = 0
                for (let i = 0; i < shoppingcart.length; i++) {
                    const d = shoppingcart[i]
                    totalWeight += d.totalWeight
                    totalPrice += d.totalPrice
                }

                // 生成订单
                const orderData = {
                    uid: uid,
                    openId: userData.openId,
                    address: address,
                    coupon: coupon,
                    list: shoppingcart,
                    totalWeight: totalWeight,
                    totalPrice: totalPrice,
                    paymentPrice: totalPrice + postage - (coupon ? coupon.worth : 0),
                    postage: postage
                }
                
                // 创建预支付订单，同时占用库存
                const orderNo = await ctx.service.redis.createPreOrder(orderData)

                resolve(orderNo)
            }
            catch (e) {
                if (typeof e === 'string') {
                    return reject(e)
                }
                reject('系统错误')
            }
        })
    }
    
    /**
     * 成交订单，在完成支付后调用(应该由微信的接口发起调用)
     */
    deal(orderNo, uid, wxOrderNo, openId) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                const order = await ctx.service.redis.getPreOrderDetailByUid(orderNo, uid)

                if (!order) {
                    reject('订单有误，请联系管理员')
                }

                // 生成正式订单
                order.status = 11 // 表示已支付
                order.wxOrderNo = wxOrderNo // 微信支付号
                order.openId = openId // openId
                await new ctx.model.Order(order).create()

                // 消耗库存
                for (let i = 0; i < order.list.length; i++) {
                    const d = order.list[i]
                    if (d) {
                        await ctx.model.Sku.update({
                            _id: d.skuId
                        }, {
                            $inc: {
                                sellCount: 1,
                                stock: -1
                            }
                        })
                    }
                }

                // 删除redis中的预支付订单
                await ctx.service.redis.deletePreOrderByUid(orderNo, uid)

                // 用户增加积分
                await ctx.service.user.incIntegral(uid, order.paymentPrice)

                // 处理优惠券，标记为已使用并在优惠券库使用量+1
                if (order.coupon && order.coupon.id) {
                    await ctx.service.coupon.userUsed(uid, order.coupon.id, order.coupon.originId)
                }

                resolve()
            }
            catch (e) {
                console.log(e)
                if (typeof e === 'string') {
                    return reject(e)
                }
                reject('系统错误')
            }
        })
    }
    
    /**
     * 获取列表
     */
    async list(skip = 0, limit = 10, type = 1, search = {}) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量

                // 等待处理的
                if (type == 1) {
                    search.status = 11
                }
                // 已发货的
                else if (type == 3) {
                    search.status = 21
                }
                // 等待发货的
                else if (type == 4) {
                    search.status = 20
                }
                // 其他订单，就是已发货之后的状态的，以及关闭的订单
                else {
                    search.status = 90
                }
                let count = await ctx.model.Order.count(search)

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Order.aggregate([
                        { $match: search },
                        { $project: { _id: 0, __v: 0 } },
                        { $skip: skip },
                        { $limit: limit }
                    ])
                }

                resolve({
                    list,
                    count,
                    skip,
                    limit
                })
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 更新订单状态
     */
    async updateStatus(orderNo, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {    
                // 检查data的参数
                if (!orderNo) {
                    return reject('orderNo不能为空')
                }
                // 只可以关闭、发货、等待发货
                else if (data.status !== 90 && data.status !== 21 && data.status !== 20) {
                    return reject('status参数错误')
                }
                else if (data.status === 90 && data.statusMark === '') {
                    return reject('备注不能为空')
                }
                else {
                    const res = await ctx.model.Order.update({
                        orderNo: orderNo
                    }, {
                        $set: {
                            status: data.status,
                            statusMark: data.statusMark
                        }
                    })

                    if (res.n) {
                        resolve()
                    }
                    else {
                        reject('修改失败')
                    }
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 根据id获取订单
     */
    async getByOrderNo(orderNo) {
        const ctx = this.ctx
    	return new Promise(async function(resolve, reject) {
    	    try {
                if (!orderNo) {
                    return reject('orderNo不能为空')
                }

                const data = await ctx.model.Order.findOne({
                    orderNo: orderNo
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的订单')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}
}

module.exports = order