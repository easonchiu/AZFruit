const Service = require('egg').Service;

class coupon extends Service {
    
    /**
     * 获取列表
     */
    async list(skip, limit) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 计算条目数量
            const count = await ctx.model.Coupon.count({})

            // 查找数据
            let list = []
            if (count > 0) {
                list = await ctx.model.Coupon.aggregate([
                    { $sort: { online: -1, index: 1 } },
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
        })
    }

    /**
     * 根据id获取优惠券
     */
    async getById(id) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            if (!id) {
                reject('id不能为空')
            }
            else if (id.length !== 24) {
                reject('id不正确')
            }

            const data = await ctx.model.Coupon.findOne({
                _id: id
            }, {
                _id: 0,
                __v: 0
            })

            if (data) {
                resolve(data)
            }
            else {
                reject('未找到相关的优惠券')
            }
        })
    }

    /**
     * 根据id删除优惠券
     */
    async deleteById(id) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            if (!id) {
                reject('id不能为空')
            }
            else if (id.length !== 24) {
                reject('id不正确')
            }

            const data = await ctx.model.Coupon.remove({
                _id: id
            })

            if (data) {
                resolve(data)
            }
            else {
                reject('未找到相关的优惠券')
            }
        })
    }
    
}

module.exports = coupon