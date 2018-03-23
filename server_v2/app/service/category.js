const Service = require('egg').Service;

class category extends Service {
    
    /**
     * 创建分类
     */
    async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!data.name) {
                    return reject('分类名不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.index)) {
                    return reject('排序编号不能为空且必须为数字')
                }

                await new ctx.model.Category(data).create()

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
    async list(skip, limit) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.Category.count({})

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Category.aggregate([
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
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
	
	/**
     * 获取全部在线列表
     */
    async allOnlineList() {
		const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.Category.count({
                    online: true
                })

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Category.aggregate([
                        { $match: { online: true } },
                        { $sort: { index: 1 } },
                        { $project: { _id: 0, __v: 0 } },
                    ])
                }

                resolve({
                    list,
                    count,
                })
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 更新分类
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
                    return reject('分类名不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.index)) {
                    return reject('排序编号不能为空且必须为数字')
                }

                const res = await ctx.model.Category.update({
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
     * 根据id获取分类
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

                const data = await ctx.model.Category.findOne({
                    _id: id
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的分类')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}

    /**
     * 根据id删除分类
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

                const data = await ctx.model.Category.remove({
                    _id: id
                })

                if (data.result.n) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的分类')
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
    
}

module.exports = category