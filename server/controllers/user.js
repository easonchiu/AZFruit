var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/clientJwtKey')

var mongoose = require('../conf/mongoose')
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

			if (!body.vercode) {
				return ctx.error({
					msg: '请输入验证码'
				})
			}
			
			// 先找该用户
			const find = await User.findOne({
				mobile: body.mobile
			})
			
			// 找到了说明已有用户
			if (find) {
				const token = jwt.sign({
			        mobile: body.mobile,
			        uid: find._id
			    }, jwtKey)

				return ctx.success({
					data: {
						mobile: find.mobile,
						token
					}
				})
			}
			
			// 找不到，创建用户
			const res = await User.create({
				mobile: body.mobile
			})

			console.log(res)

			const token = jwt.sign({
		        mobile: body.mobile,
		        uid: res._id
		    }, jwtKey)

			return ctx.success({
				data: {
					mobile,
					token
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
			
			// 手动生成objectId，如果需要设置成默认时直接采用
			const addressId = new mongoose.Types.ObjectId()
			
			// 需要操作的数据
			const sql = {
				$push: {
					addressList: {
						_id: addressId,
						city: body.city,
						cityCode: body.cityCode,
						zipCode: body.zipCode,
						mobile: body.mobile,
						address: body.address,
						desc: body.desc,
						def: body.def
					}
				}
			}
			
			// 如果新的一条设置成了默认地址，要将defaultAddress设置成这条
			if (body.def) {
				sql.$set = {
					defaultAddress: addressId
				}
			}

			// 添加新地址
			await User.update({
				_id: body.id
			}, sql)

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
}

module.exports = user