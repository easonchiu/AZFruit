const Service = require('egg').Service;

class goods extends Service {

    /**
	 * 创建商品
     */
	async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
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
        })
	}

    /**
     * 获取列表
     */
    async list(skip, limit) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 计算条目数量
            const count = await ctx.model.Goods.count({})

            // 查找数据
            let list = []
            if (count > 0) {
                list = await ctx.model.Goods.aggregate([
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
     * 更新商品
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
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
            }, data)

            if (res.n) {
                resolve()
            }
            else {
                reject('修改失败')
            }
        })
    }

    /**
     * 根据id获取商品
     */
    async getById(id) {
        const ctx = this.ctx
    	return new Promise(async function(resolve, reject) {
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
                return resolve(data)
            }
            else {
    	        return reject('未找到相关的banner')
            }
		})
	}

    /**
     * 根据id删除商品
     */
    async deleteById(id) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
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
                return resolve(data)
            }
            else {
                return reject('未找到相关的banner')
            }
        })
    }
    
    /**
     * 获取排行榜列表
     */
    async rankingList(length) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            const data = await ctx.model.Goods.aggregate([
                { $match: { online: true, skuCount: { '$gt': 0 } } },
                { $sort: { ranking: -1 } },
                { $limit: length },
                { $project: { _id: 0, id: 1, name: 1, cover: 1, ranking: 1 } }
            ])

            if (data) {
                return resolve(data)
            }
            else {
                return reject('未找到相关的数据')
            }
        })
    }

    /**
     * 修改商品排行
     */
    async updateRankingById(id, ranking) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
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
                ranking: ranking
            })

            if (data.n) {
                resolve()
            }
            else {
                reject('修改失败')
            }
        })
    }

    /**
     * 获取推荐列表
     */
    async recomList(length) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            const data = await ctx.model.Goods.aggregate([
                { $match: { online: true, skuCount: { '$gt': 0 } } },
                { $sort: { recom: -1 } },
                { $limit: length },
                { $project: { _id: 0, id: 1, name: 1, cover: 1, recom: 1 } }
            ])

            if (data) {
                return resolve(data)
            }
            else {
                return reject('未找到相关的数据')
            }
        })
    }

    /**
     * 修改商品排行
     */
    async updateRecomById(id, recom) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
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
                recom: recom
            })

            if (data.n) {
                resolve()
            }
            else {
                reject('修改失败')
            }
        })
    }
    
}

module.exports = goods