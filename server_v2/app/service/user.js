const Service = require('egg').Service;

class banner extends Service {

    /**
     * 获取列表
     */
    async list(skip, limit) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量
                const count = await ctx.model.User.count({})

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.User.aggregate([
                        { $sort: { createTime: -1 } },
                        { $project: { _id: 0, id: '$_id', openId: 1, mobile: 1, integral: 1, createTime: 1 } },
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
     * 根据id获取用户信息
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

                const data = await ctx.model.User.findOne({
                    _id: id
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的用户')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}
}

module.exports = banner