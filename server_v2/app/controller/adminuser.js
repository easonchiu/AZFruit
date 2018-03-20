'use strict';

const Controller = require('egg').Controller;
const jwt = require('../middleware/jwt')

class AdminuserController extends Controller {
    async create(ctx) {
        const name = 'admin'
        const pwd = 'a123456'

        try {
            const find = await ctx.service.adminuser.find({
                username: name
            })

            if (find) {
                return ctx.error({
                    msg: '已存在'
                })
            }

            await ctx.service.adminuser.create({
                username: name,
                password: pwd,
            })

            return ctx.success()
        }
        catch(e) {
            return ctx.error()
        }
    }

    async login(ctx) {
        try {
            const { username, password } = ctx.request.body

            if (!username) {
                return ctx.error({
                    msg: '用户名不能为空'
                })
            }
            else if (!password) {
                return ctx.error({
                    msg: '密码不能为空'
                })
            }

            const find = await ctx.service.adminuser.find({
                username: username,
                password: password
            })

            if (!find) {
                return ctx.error({
                    msg: '用户名或密码有误'
                })
            }
            else {
                const token = jwt.createToken({
                    username: username,
                    id: find._id
                })

                return ctx.success({
                    data: {
                        token: token
                    }
                })
            }
        }
        catch (e) {
            return ctx.error()
        }
    }

}

module.exports = AdminuserController;
