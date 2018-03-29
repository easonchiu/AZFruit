const Service = require('egg').Service;
const mongoose = require('mongoose')
const createJwtToken = require('../middleware/clientJwt').createToken
const axios = require('axios')
const amapKey = require('../conf/amapKey')
const IVCSUNshop = require('../conf/IVCSUNshop')

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
     * 给用户添加地址
     */
    async createAddress(id, data, isNew = true) {
        const th = this
        const ctx = th.ctx
        return new Promise(async function(resolve, reject) {
            try {
                if (!id) {
                    return reject('用户id不能为空')
                }
                else if (!isNew && !data.id) {
                    return reject('地址id不能为空')
                }
                else if (!data.name) {
                    return reject('收货人姓名不能为空')
                }
                else if (!(/1\d{10}/).test(data.mobile)) {
                    return reject('请输入正确的手机手机号码')
                }
                else if (!data.area) {
                    return reject('请选择小区')
                }
                else if (!data.address) {
                    return reject('请输入门牌号(例2号楼201室)')
                }

                // 更新地址的话需要先检查该地址是否已有
                if (!isNew) {
                    const res = await ctx.model.User.findOne({
                        _id: id,
                        'addressList.id': data.id
                    })

                    if (!res) {
                        return reject('该地址不存在')
                    }
                }

                // 获取经纬度
                const locationInfo = await th._amapLocation(data.areaAddress)

                // 经纬度获取失败
                if (!locationInfo || !locationInfo.location) {
                    return reject('小区地址不够详细')
                }

                // 获取直线距离
                const location = locationInfo.location.split(',')
                const distanceInfo = await th._amapDistance(location[0], location[1])
                if (!distanceInfo.distance) {
                    return reject('距离计算失败')
                }

                // 添加时：查询地址数量判断是否是用户的第一个地址
                // 如果是，那这条地址肯定是默认地址
                if (isNew) {

                    // 手动生成objectId，如果需要设置成默认时直接采用
                    const addressId = new mongoose.Types.ObjectId()

                    // 新地址
                    const newAddress = {
                        id: addressId,
                        name: data.name,
                        mobile: data.mobile,
                        area: data.area,
                        areaAddress: data.areaAddress,
                        lat: location[0],
                        lon: location[1],
                        distance: distanceInfo.distance,
                        address: data.address,
                    }

                    // 脚本
                    const sql = {
                        $push: {
                            addressList: newAddress
                        }
                    }

                    const userData = await ctx.service.user.getById(id)

                    // 如果指定为默认地址，或者用户的地址中没有数据，这条设为默认
                    if (data.default || !userData || !userData.addressList.length) {
                        sql.defaultAddress = addressId
                    }

                    // 将新地址存进文档
                    const res = await ctx.model.User.update({
                        _id: id
                    }, sql, {
                        upsert: true
                    })

                    if (res.n) {
                        resolve()
                    }
                    else {
                        reject('系统错误')
                    }
                }
                else {
                    // 新地址
                    const newAddress = {
                        'addressList.$.name': data.name,
                        'addressList.$.mobile': data.mobile,
                        'addressList.$.area': data.area,
                        'addressList.$.areaAddress': data.areaAddress,
                        'addressList.$.lat': location[0],
                        'addressList.$.lon': location[1],
                        'addressList.$.distance': distanceInfo.distance,
                        'addressList.$.address': data.address,
                    }

                    // 脚本
                    const sql = {
                        $set: newAddress
                    }

                    // 如果要更新默认地址
                    if (data.default) {
                        sql.defaultAddress = data.id
                    }

                    // 将地址存进文档
                    const res = await ctx.model.User.update({
                        _id: id,
                        'addressList.id': data.id
                    }, sql)

                    if (res.n) {
                        resolve()
                    }
                    else {
                        reject('系统错误')
                    }
                }
            }
            catch (e) {
                return reject('系统错误')
            }
        })
    }

    /**
     * 用户删除地址
     */
    async removeAddress(id, addressId) {
        const th = this
        const ctx = th.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查参数
                if (!id) {
                    return reject('用户id不能为空')
                }
                else if (!addressId) {
                    return reject('地址id不能为空')
                }

                
                const userData = await ctx.service.user.getById(id)
                
                if (!userData) {
                    return reject('找不到相关的用户')
                }
                
                // 检查删除的是不是默认地址，找地址库中的第一条
                let defaultAddress = userData.defaultAddress
                if (addressId === userData.defaultAddress) {
                    const list = userData.addressList || []
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].id !== addressId) {
                            defaultAddress = list[i].id
                            break
                        }
                    }
                }

                // 找到并删除相关的那条地址信息
                const res = await ctx.model.User.update({
                    _id: id,
                    'addressList.id': addressId
                }, {
                    $pull: {
                        addressList: {
                            id: addressId
                        }
                    },
                    $set: {
                        defaultAddress
                    }
                })





                if (res.n) {
                    resolve()
                }
                else {
                    reject('系统错误')
                }
            }
            catch (e) {
                return reject('系统错误')
            }
        })
    }

    
    /**
     * 根据地址获取经纬度
     */
    async _amapLocation(address) {
        return new Promise(async function(resolve, reject) {
            try {
                const locationInfo = await axios.request({
                    method: 'get',
                    url: 'http://restapi.amap.com/v3/geocode/geo',
                    params: {
                        address: address,
                        city: '上海',
                        output: 'json',
                        key: amapKey
                    }
                })

                if (!locationInfo.data.geocodes) {
                    resolve()
                }
                else {
                    resolve(locationInfo.data.geocodes[0])
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    async _amapDistance(lat, lon) {
        return new Promise(async function(resolve, reject) {
            try {
                const distanceInfo = await axios.request({
                    method: 'get',
                    url: 'http://restapi.amap.com/v3/distance',
                    params: {
                        origins: `${lat},${lon}`,
                        destination: `${IVCSUNshop.lat},${IVCSUNshop.lon}`,
                        output: 'json',
                        key: amapKey,
                        type: 0, // 取直线距离(因为稳定)
                    }
                })
                
                if (!distanceInfo.data.results) {
                    reject('系统错误')
                }
                else {
                    resolve(distanceInfo.data.results[0])
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
                
                // 限制一次购买的数量
                if (hasBuy && hasBuy.amount >= 9) {
                    return reject('一次最多可购买9件哦~')
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

}

module.exports = user