const Service = require('egg').Service;

class banner extends Service {

    /**
	 * 创建banner
     */
	async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!data.uri) {
                    return reject('图片地址不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.index)) {
                    return reject('排序编号不能为空且必须为数字')
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
     * 获取列表
     */
    async list(skip = 0, limit = 10, search = {}) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.Banner.count(search)

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Banner
                    .find(search, { _id: 0, __v: 0, createTime: 0 })
                    .sort({ online: -1, index: 1 })
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
     * 更新banner
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {    
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }
                else if (!data.uri) {
                    return reject('图片地址不能为空')
                }
                else if (!(/^[0-9]*$/g).test(data.index)) {
                    return reject('排序编号不能为空且必须为数字')
                }

                const res = await ctx.model.Banner.update({
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
     * 根据id获取banner
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

                const data = await ctx.model.Banner.findOne({
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
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}

    /**
     * 根据id删除banner
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

                const data = await ctx.model.Banner.remove({
                    _id: id
                })

                if (data.result.n) {
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
}

module.exports = banner