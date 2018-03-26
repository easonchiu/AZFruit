const Service = require('egg').Service;

class coupon extends Service {
    
    /**
     * 创建优惠券
     */
    async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!data.name) {
                    return reject('优惠券名称不能为空')
                }
                else if (!data.batch) {
                    return reject('优惠券批次号不能为空')
                }
                else if (data.amount == undefined || data.amount <= 0) {
                    return reject('预设数量必须大于0')
                }
                else if (data.worth == undefined || data.worth <= 0) {
                    return reject('可抵扣金额必须大于0')
                }
                else if (data.condition == undefined || data.condition < 0) {
                    return reject('使用条件必须大于等于0')
                }
                else if (!data.flag) {
                    return reject('请选择发放方式')
                }
                else if (data.expiredTime == undefined || data.expiredTime < 0) {
                    return reject('过期期限必须大于0天')
                }

                await new ctx.model.Banner(data).create()

                resolve()
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 更新优惠券
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }
                if (!data.name) {
                    return reject('优惠券名称不能为空')
                }
                else if (!data.batch) {
                    return reject('优惠券批次号不能为空')
                }
                else if (data.amount == undefined || data.amount <= 0) {
                    return reject('预设数量必须大于0')
                }
                else if (data.worth == undefined || data.worth <= 0) {
                    return reject('可抵扣金额必须大于0')
                }
                else if (data.condition == undefined || data.condition < 0) {
                    return reject('使用条件必须大于等于0')
                }
                else if (!data.flag) {
                    return reject('请选择发放方式')
                }
                else if (data.expiredTime == undefined || data.expiredTime < 0) {
                    return reject('过期期限必须大于0天')
                }

                const res = await ctx.model.Coupon.update({
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
     * 获取列表
     */
    async list(skip = 0, limit = 10, search = {}) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.Coupon.count(search)

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Coupon.aggregate([
                        { $match: search },
                        { $sort: { online: -1, index: 1 } },
                        { $project: { _id: 0, __v: 0, createTime: 0 } },
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
     * 根据id获取优惠券
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

                const data = await ctx.model.Coupon.findOne({
                    _id: id
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的优惠券')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 根据id删除优惠券
     */
    async deleteById(id) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                if (!id) {
                    return reject('id不能为空')
                }
                else if (id.length !== 24) {
                    return reject('id不正确')
                }

                const data = await ctx.model.Coupon.remove({
                    _id: id
                })

                if (data.result.n) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的优惠券')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
    
}

module.exports = coupon