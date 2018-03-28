const Service = require('egg').Service;
const mongoose = require('mongoose')
const createJwtToken = require('../middleware/clientJwt').createToken


class user extends Service {
    
    /**
     * 创建用户
     */
    async create(mobile, check = false) {
        const th = this
        const ctx = th.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!mobile) {
                    return reject('请输入手机号')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('请输入正确的手机号')
                }

                // 查找是否存在
                if (check) {
                    const userData = await th.getByMobile(mobile)
                    if (userData) {
                        resolve(userData.id)
                    }
                }

                // 分配一个id给用户
                const id = new mongoose.Types.ObjectId()

                await new ctx.model.User({
                    mobile: mobile,
                    _id: id
                }).create()

                // 返回这个id
                resolve(id)
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 更新用户
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {    
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }

                const res = await ctx.model.User.update({
                    _id: id
                }, {
                    $set: data
                })

                if (res.n) {
                    resolve()
                }
                else {
                    reject('修改失败')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 生成token(jwt)
     */
    async createToken(mobile, uid) {
        const token = createJwtToken({
            mobile,
            uid
        })
        return Promise.resolve(token)
    }

    /**
     * 获取列表
     */
    async list(skip, limit) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.User.count({})

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.User.aggregate([
                        { $sort: { createTime: -1 } },
                        { $project: { _id: 0, id: '$_id', openId: 1, mobile: 1, integral: 1, createTime: 1 } },
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
     * 根据id获取用户信息
     */
    async getById(id) {
        const ctx = this.ctx
    	return new Promise(async function(resolve, reject) {
    	    try {
                if (!id) {
                    return reject('id不能为空')
                }
                else if (id.length !== 24) {
                    return reject('id不正确')
                }

                const data = await ctx.model.User.findOne({
                    _id: id
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的用户')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}

    /**
     * 根据mobile获取用户信息
     */
    async getByMobile(mobile) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                if (!mobile) {
                    return reject('手机号不能为空')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('手机号不正确')
                }

                const data = await ctx.model.User.findOne({
                    mobile
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return resolve(null)
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 添加商品到购物车
     */
    async addToShoppingCartById(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }
                else if (!data.skuId || !data.pid) {
                    return reject('找不到相关的商品')
                }
                else if (!data.amount || data.amount !== ~~data.amount) {
                    return reject('请选择购买数量')
                }
            
                // 先查看购物车中是否有相同的商品
                const userData = await ctx.service.user.getById(id)
                const shoppingcart = userData.shoppingcart
                let hasBuy = false
                for (let i = 0; i < shoppingcart.length; i++) {
                    if (shoppingcart[i].skuId === data.skuId) {
                        hasBuy = shoppingcart[i]
                    }
                }

                // 查看商品信息
                const sku = await ctx.service.sku.getById(data.skuId)
                if (!sku.online) {
                    return reject('该规格已下架，请购买其他规格商品')
                }
                const goods = await ctx.service.goods.getById(sku.pid)
                if (!goods.online) {
                    return reject('该商品已下架，请购买其他商品')
                }

                // 计算我购买的数量
                let willAmount = data.amount
                if (hasBuy) {
                    willAmount += hasBuy.amount
                }
                // 超过库存，不让购买
                if (willAmount > sku.stock) {
                    return reject('库存不够了哦，您最多可购买' + sku.stock + sku.unit)
                }

                // 更新购物车
                if (hasBuy) {
                    hasBuy.amount = willAmount
                    hasBuy.totalWeight = hasBuy.weight * willAmount
                    hasBuy.totalPrice = hasBuy.price * willAmount
                }
                // 购物车中没有，新增
                else {
                    const newSku = {
                        skuName: sku.desc,
                        amount: willAmount,
                        weight: sku.weight,
                        totalWeight: sku.weight * willAmount,
                        online: true,
                        cover: goods.cover,
                        name: goods.name,
                        unit: sku.unit,
                        price: sku.price,
                        stock: sku.stock,
                        skuId: sku.id,
                        pid: sku.pid,
                        totalPrice: sku.price * willAmount
                    }
                    shoppingcart.push(newSku)
                }

                await ctx.service.user.update(id, {
                    shoppingcart
                })

                return resolve()
            }
            catch(e) {
                if (typeof e === 'string') {
                    return reject(e)
                }
                reject('系统错误')
            }
        })
    }

    /**
     * 更新用户信息
     */
    async update(id, data = {}) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {    
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }

                const res = await ctx.model.User.update({
                    _id: id
                }, {
                    $set: data
                })

                if (res.n) {
                    resolve()
                }
                else {
                    reject('修改失败')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
}

module.exports = user