const Service = require('egg').Service;

class goods extends Service {

    /**
	 * 创建商品
     */
	async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!data.name) {
                    return reject('商品名称不能为空')
                }
                else if (!data.cover) {
                    return reject('商品封面图不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.index)) {
                    return reject('排序编号不能为空且必须为数字')
                }

                await new ctx.model.Goods(data).create()

                resolve()
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
                const count = await ctx.model.Goods.count(search)

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Goods.aggregate([
                        { $match: search },
                        { $sort: { online: -1, index: 1 } },
                        { $project: { _id: 0, __v: 0, imgs: 0, parameter: 0, createTime: 0, category: 0 } },
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
     * 更新商品
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }
                else if (!data.name) {
                    return reject('商品名称不能为空')
                }
                else if (!data.cover) {
                    return reject('商品封面图不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.index)) {
                    return reject('排序编号不能为空且必须为数字')
                }

                const res = await ctx.model.Goods.update({
                    _id: id
                }, {
                    $set: data
                })

                if (res.n) {
                    // 更新缓存
                    await ctx.service.redis.setGoodsInfo(id, data)

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
     * 根据id获取商品
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

                const data = await ctx.model.Goods.findOne({
                    _id: id
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    // 更新缓存
                    await ctx.service.redis.setGoodsInfo(id, data)
                    
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的banner')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}

    /**
     * 根据id删除商品
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

                const data = await ctx.model.Goods.remove({
                    _id: id
                })

                if (data.result.n) {
                    // 删除缓存
                    await ctx.service.redis.setGoodsInfo(id, null)

                    return resolve(data)
                }
                else {
                    return reject('未找到相关的banner')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
    
    /**
     * 获取排行榜列表
     */
    async rankingList(length) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                const data = await ctx.model.Goods.aggregate([
                    { $match: { online: true, skuCount: { '$gt': 0 } } },
                    { $sort: { ranking: -1 } },
                    { $limit: length },
                    { $project: { _id: 0, __v: 0, imgs: 0, parameter: 0, createTime: 0, category: 0 } },
                ])

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的数据')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 修改商品排行
     */
    async updateRankingById(id, ranking) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                if (!id) {
                    return reject('id不能为空')
                }
                else if (id.length !== 24) {
                    return reject('id不正确')
                }
                else if (ranking == undefined) {
                    return reject('商品排名不能为空')
                }
                else if (ranking < 0 || ranking > 9999) {
                    return reject('商品排名权重不能小于0或大于9999')
                }

                const data = await ctx.model.Goods.update({
                    _id: id
                }, {
                    $set: {
                        ranking: ranking
                    }
                })

                if (data.n) {
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
     * 获取推荐列表
     */
    async recomList(length) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                const data = await ctx.model.Goods.aggregate([
                    { $match: { online: true, skuCount: { '$gt': 0 } } },
                    { $sort: { recom: -1 } },
                    { $limit: length },
                    { $project: { _id: 0, __v: 0, imgs: 0, parameter: 0, createTime: 0, category: 0 } },
                ])

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的数据')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 修改商品排行
     */
    async updateRecomById(id, recom) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                if (!id) {
                    return reject('id不能为空')
                }
                else if (id.length !== 24) {
                    return reject('id不正确')
                }
                else if (recom == undefined) {
                    return reject('商品排名不能为空')
                }
                else if (recom < 0 || recom > 9999) {
                    return reject('商品推荐权重不能小于0或大于9999')
                }

                const data = await ctx.model.Goods.update({
                    _id: id
                }, {
                    $set: {
                        recom: recom
                    }
                })

                if (data.n) {
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
     * 修改商品表中的sku最低价之类的信息
     */
    async updateSkuInfo(id) {
        const th = this
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 获取相关sku，在线，库存大于0的
                const res = await ctx.model.Sku.aggregate([
                    { $match: { pid: id, online: true, stock: { $gt: 0 } } },
                    { $sort: { price: 1 } },
                    { $project: { _id: 0, unit: 1, price: 1, prePrice: 1 } }
                ])
                
                // 初始化
                const data = {
                    skuCount: 0,
                    price: 0,
                    prePrice: 0,
                    unit: ''
                }
                
                // 如果有数据，在商品表中存入库存数量与最低的sku价格
                if (res[0]) {
                    data.skuCount = res.length
                    data.price = res[0].price || 0
                    data.prePrice = res[0].prePrice || 0
                    data.unit = res[0].unit || ''
                }

                // 更新到产品的数据库中
                const r = await ctx.model.Goods.update({
                    _id: id
                }, {
                    $set: data
                })

                if (r.n) {
                    resolve()
                }
                else {
                    reject('系统错误')
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

module.exports = goods