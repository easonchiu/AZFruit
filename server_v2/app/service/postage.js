const Service = require('egg').Service;

class postage extends Service {

    /**
	 * 创建运费规则
     */
	async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 检查data的参数
            if (!(/^[0-9]*$/g).test(data.km)) {
                return reject('超出距离不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.weight)) {
                return reject('重量不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.postage)) {
                return reject('基础运费不能为空')
            }

            await new ctx.model.Postage(data).create()

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
            const count = await ctx.model.Postage.count({})

            // 查找数据
            let list = []
            if (count > 0) {
                list = await ctx.model.Postage.aggregate([
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
     * 更新运费规则
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 检查data的参数
            if (!id) {
                return reject('id不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.km)) {
                return reject('超出距离不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.weight)) {
                return reject('重量不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.postage)) {
                return reject('基础运费不能为空')
            }

            const res = await ctx.model.Postage.update({
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
     * 根据id获取运费规则
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
		})
	}

    /**
     * 根据id删除运费规则
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

            const data = await ctx.model.Postage.remove({
                _id: id
            })

            if (data.result.n) {
                return resolve(data)
            }
            else {
                reject('未找到相关的运费规则')
            }
        })
    }
}

module.exports = postage