const Service = require('egg').Service;

class sku extends Service {

    /**
	 * 创建sku
     */
	async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!data.pid) {
                    return reject('所属产品不能为空')
                }
                else if (!data.unit) {
                    return reject('计量单位不能为空')
                }

                await new ctx.model.Sku(data).create()

                // 更新商品表的sku信息
                await ctx.service.goods.updateSkuInfo(data.pid)

                resolve()
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
     * 获取列表
     */
    async list(skip = 0, limit = 10, match = {}) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.Sku.count(match)

                // 查找数据
                let list = []
                if (count > 0) {
                    const sql = [
                        { $sort: { online: -1, index: 1 } },
                        { $project: { _id: 0, __v: 0, createTime: 0 } },
                        { $skip: skip },
                        { $limit: limit }
                    ]
                    if (match) {
                        sql.unshift({
                            $match: match
                        })
                    }
                    list = await ctx.model.Sku.aggregate(sql)
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
     * 更新sku
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }
                else if (!data.pid) {
                    return reject('所属产品不能为空')
                }
                else if (!data.unit) {
                    return reject('计量单位不能为空')
                }

                const res = await ctx.model.Sku.update({
                    _id: id
                }, {
                    $set: data
                })

                if (res.n) {
                    // 更新商品表的sku信息
                    await ctx.service.goods.updateSkuInfo(data.pid)

                    resolve()
                }
                else {
                    reject('修改失败')
                }
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
     * 根据id获取sku
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

                const data = await ctx.model.Sku.findOne({
                    _id: id
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的sku')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}

    /**
     * 根据id删除sku
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

                const find = await ctx.model.Sku.findById(id)

                if (!find) {
                    return reject('未找到相关的sku')
                }

                const data = await ctx.model.Sku.remove({
                    _id: id
                })

                if (data.result.n) {
                    // 更新商品表的sku信息
                    await ctx.service.goods.updateSkuInfo(find.pid)

                    return resolve(data)
                }
                else {
                    return reject('未找到相关的sku')
                }
            }
            catch (e) {
                if (typeof e === 'string') {
                    return reject(e)
                }
                reject('系统错误')
            }
        })
    }
}

module.exports = sku