const Service = require('egg').Service;
const axios = require('axios')
const amapKey = require('../conf/amapKey')
const IVCSUNshop = require('../conf/IVCSUNshop')

class Address extends Service {

	/**
     * 给用户添加地址
     */
    async create(id, data, isNew = true) {
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
    async remove(id, addressId) {
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

}

module.exports = Address