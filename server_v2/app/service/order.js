const Service = require('egg').Service;

class order extends Service {
    
    /**
     * 创建订单
     */
    async create(data) {
        const ctx = this.ctx
        const {uid} = ctx.jwt || {}
        return new Promise(async function(resolve, reject) {
            try {
                const addressId = data.addressId
                if (!addressId) {
                    return reject('地址不能为空')
                }
                
                // 找到用户的选中地址
                const userData = await ctx.service.user.getById(uid)
                
                const address = userData.addressList.find(res => res.id === addressId)

                if (!address) {
                    return reject('找不到相关的地址信息')
                }




                resolve()
            }
            catch (e) {
                console.log(e)
                reject('系统错误')
            }
        })
    }

    /**
     * 获取列表
     */
    async list(skip = 0, limit = 10, type = 1, search = {}) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 计算条目数量

                // 等待处理的
                if (type == 1) {
                    search.status = 11
                }
                // 已发货的
                else if (type == 3) {
                    search.status = 21
                }
                // 等待发货的
                else if (type == 4) {
                    search.status = 20
                }
                // 其他订单，就是已发货之后的状态的，以及关闭的订单
                else {
                    search.status = 90
                }
                let count = await ctx.model.Order.count(search)

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Order.aggregate([
                        { $match: search },
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
     * 更新订单状态
     */
    async updateStatus(orderNo, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {    
                // 检查data的参数
                if (!orderNo) {
                    return reject('orderNo不能为空')
                }
                // 只可以关闭、发货、等待发货
                else if (data.status !== 90 && data.status !== 21 && data.status !== 20) {
                    return reject('status参数错误')
                }
                else if (data.status === 90 && data.statusMark === '') {
                    return reject('备注不能为空')
                }
                else {
                    const res = await ctx.model.Order.update({
                        orderNo: orderNo
                    }, {
                        $set: {
                            status: data.status,
                            statusMark: data.statusMark
                        }
                    })

                    if (res.n) {
                        resolve()
                    }
                    else {
                        reject('修改失败')
                    }
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 根据id获取订单
     */
    async getByOrderNo(orderNo) {
        const ctx = this.ctx
    	return new Promise(async function(resolve, reject) {
    	    try {
                if (!orderNo) {
                    return reject('orderNo不能为空')
                }

                const data = await ctx.model.Order.findOne({
                    orderNo: orderNo
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return reject('未找到相关的订单')
                }
            }
            catch (e) {
                reject('系统错误')
            }
		})
	}
}

module.exports = order