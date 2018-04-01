const Service = require('egg').Service;

class redis extends Service {
    
    /**
     * 创建预支付订单，同时占用库存
     */
    createPreOrder(orderData) {
        const th = this
        const ctx = th.ctx
        const redis = th.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                if (!orderData) {
                    reject('生成预支付订单失败')
                }

                const orderNo = await th._createOrderNo()
                orderData.orderNo = orderNo
                orderData.wxOrderNo = ''
                orderData.status = 1
                orderData.createTime = new Date()

                const key = 'ORDER.' + orderNo + ':' + orderData.uid
                redis.set(key, JSON.stringify(orderData))
                redis.expire(key, 60 * 35) // 35分钟（支付30分钟）

                // 把库存占用起来
                for (let i = 0; i < orderData.list.length; i++) {
                    const d = orderData.list[i]
                    await ctx.service.redis.appendSkuLock(d.skuId, orderNo, orderData.uid, d.amount)
                }

                resolve(orderNo)
            }
            catch(e) {
                reject('生成预支付订单失败')
            }
        })
    }

    /**
     * 生成订单号
     */
    async _createOrderNo() {
        const redis = this.app.redis
        let count = await redis.incr('ORDER_COUNT')

        if (count > 999) {
            count = 0
            redis.set('ORDER_COUNT', 0)
        }
        count = ('0000' + count).substr(-3)

        const now = new Date()
        // 创建个订单号，订单号为当前系统时间的秒级，再加计数器，所以理论上支持到1秒1000单
        const yy = ('' + now.getFullYear()).substr(-2)
        const mm = ('0000' + (now.getMonth() + 1)).substr(-2)
        const dd = ('0000' + now.getDate()).substr(-2)
        const h = ('0000' + now.getHours()).substr(-2)
        const m = ('0000' + now.getMinutes()).substr(-2)
        const s = ('0000' + now.getSeconds()).substr(-2)
        const orderNo = yy + mm + dd + h + m + s + count

        return orderNo
    }

    /**
     * 占用库存
     */
    appendSkuLock(skuId, orderNo, uid, amount) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                const key = 'SKU_LOCK.' + skuId + ':' + orderNo + ':' + uid
                await redis.set(key, amount)
                redis.expire(key, 60 * 35) // 35分钟（支付30分钟）

                resolve()
            }
            catch (e) {
                resolve()
            }
        })
    }

    /**
     * 获取sku的占用库存
     */
    async getSkuLock(id) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return resolve(0)
                }
                
                // 用通道的方式找所有的库存占用
                let keys = await redis.keys('SKU_LOCK.' + id + ':*')
                
                if (!keys) {
                    keys = []
                }
                
                const pipeline = redis.pipeline()
                for (let i = 0; i < keys.length; i++) {
                    pipeline.get(keys[i])
                }
                const arr = await pipeline.exec()
                
                let count = 0
                arr.forEach(res => {
                    if (!res[0]) {
                        count += +res[1]
                    }
                })

                resolve(count)

            }
            catch(e) {
                resolve(0)
            }
        })
    }


    /**
     * 获取预支付订单列表
     */
    async getPreOrderListByUid(uid) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                const key = 'ORDER.*:' + uid

                let keys = await redis.keys(key)
                if (!keys) {
                    keys = []
                }

                const pipeline = redis.pipeline()
                for (let i = 0; i < keys.length; i++) {
                    pipeline.get(keys[i])
                    pipeline.ttl(keys[i])
                }
                const arr = await pipeline.exec()

                const list = arr.filter((res, i) => {
                    // 过滤报错的，还有ttl返回
                    if (res[0] || i % 2 === 1) {
                        return false
                    }
                    // 过滤订单过期时间，少于5分钟不可支付
                    const ttl = parseInt(arr[i + 1][1])
                    if (ttl < 300) {
                        return false
                    }

                    return true
                }).map(res => JSON.parse(res[1]))

                resolve(list)
            }
            catch(e) {
                resolve([])
            }
        })
    }

    /**
     * 获取预支付订单详情
     */
    async getPreOrderDetailByUid(orderNo, uid) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                if (!orderNo || !uid) {
                    return reject('缺少参数')
                }

                const key = 'ORDER.' + orderNo + ':' + uid

                let res = await redis.get(key)

                if (res) {
                    res = JSON.parse(res)
                    const ttl = await redis.ttl(key)
                    // 订单会预留5分钟的容错时间，即35分钟删除，30分钟支付
                    res.paymentTimeout = ttl - 300

                    // 少于5分钟不可支付
                    if (res.paymentTimeout < 0) {
                        return reject('订单已过期，请重新下单')
                    }
                }

                resolve(res)
            }
            catch(e) {
                resolve()
            }
        })
    }
    
    /**
     * 删除预支付订单
     */
    async deletePreOrderByUid(orderNo, uid) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                if (!orderNo || !uid) {
                    return reject('缺少参数')
                }
                
                // 查找缓存中的预支付订单
                const orderKey = 'ORDER.' + orderNo + ':' + uid
                let order = await redis.get(orderKey)

                if (order) {
                    order = JSON.parse(order)
                    
                    // 用管道批量删除订单所占的库存
                    const pipeline = redis.pipeline()
                    for (let i = 0; i < order.list.length; i++) {
                        const d = order.list[i]
                        const key = 'SKU_LOCK.' + d.skuId + ':' + orderNo + ':' + uid
                        pipeline.del(key)
                    }
                    await pipeline.exec()

                    // 删除订单
                    await redis.del(orderKey)

                    resolve(true)
                }

                resolve()
            }
            catch(e) {
                resolve()
            }
        })
    }

    /**
     * 获取预支付订单的数量
     */
    async getPreOrderAmount(id) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                const key = 'ORDER.*:' + id
                const list = await redis.keys(key)

                resolve(list.length)
            }
            catch(e) {
                resolve(0)
            }
        })
    }

    /**
	 * 创建sku缓存
     */
	async setSkuInfo(id, info = null) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return resolve()
                }

                const key = 'SKU_INFO.' + id
                if (info) {
                    await redis.set(key, JSON.stringify(info))
                }
                else {
                    await redis.set(key, null)
                }

                redis.expire(key, 60 * 60 * 24)

                resolve()
            }
            catch (e) {
                resolve()
            }
        })
    }

    /**
     * 获取sku缓存
     */
    async getSkuInfo(id) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return resolve(null)
                }
                
                const key = 'SKU_INFO.' + id
                const res = await redis.get(key)

                resolve(JSON.parse(res))
            }
            catch (e) {
                resolve(null)
            }
        })
    }

    /**
     * 创建商品缓存
     */
    async setGoodsInfo(id, info = null) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return resolve()
                }

                const key = 'GOODS_INFO.' + id
                if (info) {
                    await redis.set(key, JSON.stringify(info))
                }
                else {
                    await redis.set(key, null)
                }

                redis.expire(key, 60 * 60 * 24)

                resolve()
            }
            catch (e) {
                resolve()
            }
        })
    }

    /**
     * 获取商品缓存
     */
    async getGoodsInfo(id) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return resolve(null)
                }
                
                const key = 'GOODS_INFO.' + id
                const res = await redis.get(key)

                resolve(JSON.parse(res))
            }
            catch (e) {
                resolve(null)
            }
        })
    }
    
    /**
     * 保存用户的登录验证码
     */
    async setSmsVerifcode(mobile, code, smskey) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!mobile) {
                    return reject('请输入手机号')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('请输入正确的手机号')
                }
                else if (!code || !smskey) {
                    return reject('没有成功生成验证码')
                }
                
                const key = 'VERIF_CODE.' + mobile
                await redis.hset(key, 'code', code, 'smskey', smskey)
                redis.expire(key, 60 * 30) // 30分钟有效

                resolve()
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 验证用户的登录验证码
     */
    async checkSmsVerifcode(mobile, code, smskey) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!mobile) {
                    return reject('请输入手机号')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('请输入正确的手机号')
                }
                else if (!smskey) {
                    return reject('请先获取验证码')
                }
                else if (!code) {
                    return reject('请输入验证码')
                }
                
                const key = 'VERIF_CODE.' + mobile
                const resCode = await redis.hget(key, 'code')
                const resSmskey = await redis.hget(key, 'smskey')

                if (!resCode || !resSmskey) {
                    return reject('请先获取验证码')
                }
                else if (resCode !== code || resSmskey !== smskey) {
                    return reject('验证码输入错误')
                }

                // 验证通过
                redis.del(key)

                resolve()
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
}

module.exports = redis