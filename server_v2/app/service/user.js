const Service = require('egg').Service;
const mongoose = require('mongoose')
const createJwtToken = require('../middleware/clientJwt').createToken


class user extends Service {
    
    /**
     * 创建用户
     */
    async create(mobile, check = false) {
        const th = this
        const ctx = th.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!mobile) {
                    return reject('请输入手机号')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('请输入正确的手机号')
                }

                // 查找是否存在
                if (check) {
                    const userData = await th.getByMobile(mobile)
                    if (userData) {
                        resolve(userData.id)
                    }
                }

                // 分配一个id给用户
                const id = new mongoose.Types.ObjectId()

                await new ctx.model.User({
                    mobile: mobile,
                    _id: id
                }).create()

                // 返回这个id
                resolve(id)
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    /**
     * 更新用户
     */
    async update(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {    
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }

                const res = await ctx.model.User.update({
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
     * 用户增加积分
     */
    async incIntegral(id, int) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {    
                // 检查data的参数
                if (!id || int < 0) {
                    return reject('id不能为空')
                }

                const res = await ctx.model.User.update({
                    _id: id
                }, {
                    $inc: {
                        integral: int
                    }
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
     * 生成token(jwt)
     */
    async createToken(mobile, uid) {
        const token = createJwtToken({
            mobile,
            uid
        })
        return Promise.resolve(token)
    }

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

    /**
     * 根据mobile获取用户信息
     */
    async getByMobile(mobile) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                if (!mobile) {
                    return reject('手机号不能为空')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('手机号不正确')
                }

                const data = await ctx.model.User.findOne({
                    mobile
                }, {
                    _id: 0,
                    __v: 0
                })

                if (data) {
                    return resolve(data)
                }
                else {
                    return resolve(null)
                }
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

}

module.exports = user