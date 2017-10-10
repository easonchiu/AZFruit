var User = require('../models/user')
var Reg = require('../utils/reg')

class user {
	static async fetchList(ctx, next) {

		const res = await User.find({
			
		})
		
	}
	
	static async fetchDetail(ctx, next) {

		const res = await User.find({
			
		})
		
	}
	
	// 用户登录，没有则注册
	static async login(ctx, next) {
		try {
			const body = ctx.request.body

			if (!Reg.isMobile(body.mobile)) {
				return ctx.error({
					msg: '请输入正确的手机手机号码'
				})
			}
			
			// 先找该用户
			let find = await User.findOne({
				mobile: body.mobile
			})
			
			// 找到了说明已有用户
			if (find) {
				return ctx.success({
					msg: '登录成功',
					data: {
						id: find._id,
						header: find.header,
						name: find.name,
					}
				})
			}
			
			// 找不到，创建用户
			const res = await User.create({
				mobile: body.mobile
			})

			return ctx.success({
				msg: '注册成功',
				data: {
					id: res._id,
					header: res.header,
					name: res.name,
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 添加地址
	static async createAddress(ctx, next) {
		try {
			const body = ctx.request.body
			
			if (!body.id) {
				return ctx.error({
					msg: '用户id不能为空'
				})
			}

			let find = await User.findOne({
				_id: body.id
			})

			if (!find) {
				return ctx.error({
					msg: '该用户不存在'
				})
			}
			
			// 添加新地址
			await User.update({
				_id: body.id
			}, {
				$push: {
					addressList: {
						city: body.city,
						cityCode: body.cityCode,
						zipCode: body.zipCode,
						mobile: body.mobile,
						address: body.address,
						desc: body.desc,
						def: body.def
					}
				}
			})
			
			// 如果新的一条设置成了默认地址，要将defaultAddress设置成这条
			if (body.def) {
				// 获取最新添加的那条地址
				const res = await User.findOne({_id: body.id})
				const address = res.addressList[res.addressList.length - 1]

				// 更新defaultAddress的值
				await User.update({
					_id: body.id
				}, {
					$set: {
						defaultAddress: address._id
					}
				})
			}

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
}

module.exports = user