var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/jwtKey')
var AdminUser = require('../models/adminuser')

class adminuser {
	
	/* 
	 * 创建
	 *
	 * !@username
	 * !@password
	 *
	 */
	static async create(ctx, next) {

		const name = 'admin'
		const pwd = 'a123456'

		const find = await AdminUser.findOne({
			username: name
		})

		if (find) {
			return ctx.error({
				msg: '已存在'
			})
		}
		
		try {
			await AdminUser.create({
				username: name,
				password: pwd,
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 登录
	static async login(ctx, next) {
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

			const res = await AdminUser.findOne({
				username: username,
				password: password
			})

			if (!res) {
				return ctx.error({
					msg: '用户名或密码有误'
				})
			}

		    const token = jwt.sign({
		        username: username,
		        id: res._id
		    }, jwtKey)

			return ctx.success({
				data: {
					token: token
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
}

module.exports = adminuser