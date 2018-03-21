const Service = require('egg').Service;

class upload extends Service {
    
    /**
     * 获取列表
     */
    async list(skip, limit) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 计算条目数量
            const count = await ctx.model.Upload.count({})

            // 查找数据
            let list = []
            if (count > 0) {
                list = await ctx.model.Upload.aggregate([
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
    
}

module.exports = upload