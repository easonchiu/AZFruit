const Service = require('egg').Service;

class postage extends Service {

    /**
	 * 创建运费规则
     */
	async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!(/^[0-9]*$/g).test(data.km)) {
                    return reject('公里数不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.postage)) {
                    return reject('运费不能为空')
                }

                await new ctx.model.Postage(data).create()

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
    async list(skip = 0, limit = 10) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.Postage.count({})

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Postage
                    .find({}, { _id: 0, __v: 0 })
                    .sort({ online: -1, km: 1 })
                    .skip(skip)
                    .limit(limit)
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
     * 更新运费规则
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.km)) {
                    return reject('公里数不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.postage)) {
                    return reject('运费不能为空')
                }

                const res = await ctx.model.Postage.update({
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
     * 根据id获取运费规则
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

                const data = await ctx.model.Postage.findOne({
                    _id: id
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    resolve(data)
                }
                else {
                    reject('未找到相关的运费规则')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}

    /**
     * 根据id删除运费规则
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

                const data = await ctx.model.Postage.remove({
                    _id: id
                })

                if (data.result.n) {
                    return resolve(data)
                }
                else {
                    reject('未找到相关的运费规则')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 根据距离计算运费价格
     */
    async getPriceByDistance(distance = 0) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                const list = await ctx.model.Postage
                .find({ online: true }, { _id: 0, __v: 0 })
                .sort({ km: -1 })

                // 找到最合适的规则
                let data
                for (let i = 0; i < list.length; i++) {
                    if (list[i].km * 1000 < distance * 1.2) {
                        break
                    }
                    else {
                        data = list[i]
                    }
                }

                if (data) {
                    return resolve(data.postage)
                }
                else {
                    reject('未找到相关的运费规则')
                }
            }
            catch (e) {
                console.log(e)
                reject('系统错误')
            }
        })
    }
}

module.exports = postage