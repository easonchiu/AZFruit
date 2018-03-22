const Service = require('egg').Service;

class quick extends Service {
    
    /**
     * 创建快捷入口
     */
    async create(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 检查data的参数
            if (!data.name) {
                return reject('名称不能为空')
            }
            else if (!data.uri) {
                return reject('图标地址不能为空')
            }
            else if (!data.link) {
                return reject('链接不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.index)) {
                return reject('排序编号不能为空且必须为数字')
            }

            await new ctx.model.Quick(data).create()

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
            const count = await ctx.model.Quick.count({})

            // 查找数据
            let list = []
            if (count > 0) {
                list = await ctx.model.Quick.aggregate([
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
     * 更新快捷入口
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            
            // 检查data的参数
            if (!id) {
                return reject('id不能为空')
            }
            else if (!data.name) {
                return reject('名称不能为空')
            }
            else if (!data.uri) {
                return reject('图标地址不能为空')
            }
            else if (!data.link) {
                return reject('链接不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.index)) {
                return reject('排序编号不能为空且必须为数字')
            }

            const res = await ctx.model.Quick.update({
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
     * 根据id获取分类
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

            const data = await ctx.model.Quick.findOne({
                _id: id
            }, {
                _id: 0,
                __v: 0
            })

            if (data) {
                return resolve(data)
            }
            else {
                return reject('未找到相关的快捷入口')
            }
        })
    }

    /**
     * 根据id删除快捷入口
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

            const data = await ctx.model.Quick.remove({
                _id: id
            })

            if (data.result.n) {
                return resolve(data)
            }
            else {
                return reject('未找到相关的快捷入口')
            }
        })
    }
    
}

module.exports = quick