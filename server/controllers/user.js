var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/clientJwtKey')

var UserModel = require('../models/user')
var CouponCon = require('./coupon')
var Reg = require('../utils/reg')


class Control {
	// 获取用户列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await UserModel.count({})
			let list = []

			if (count > 0) {
				list = await UserModel
					.aggregate([{
						$sort: {
							createTime: -1,
						}
					}, {
						$project: {
							_id: 0,
							id: '$_id',
							openId: 1,
							mobile: 1,
							integral: 1,
							createTime: 1,
						}
					}, {
						$skip: skip
					}, {
						$limit: limit
					}])
			}

			return ctx.success({
				data: {
					list,
					count,
					skip,
					limit,
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取用户详情
	static async fetchDetail(ctx, next) {

		const res = await UserModel.find({
			
		})
		
	}

	// 获取短信验证码
	static async getVerifcode(ctx, next) {
		try {
			const body = ctx.request.body
			const now = new Date()
			const after30s = new Date(now.getTime() + 1000 * 30)

			if (!Reg.isMobile(body.mobile)) {
				return ctx.error({
					msg: '请输入正确的手机手机号码'
				})
			}

			// 先找该用户
			let find = await UserModel.findOne({
				mobile: body.mobile
			})

			// 如果是新用户
			if (!find) {
				find = await UserModel.create({
					mobile: body.mobile,
					verifcodeTimeout: after30s
				})
			} else {
				const timeout = find.verifcodeTimeout

				// 短信验证码发送间隔时间未过
				if (timeout > now) {
					return ctx.error({
						msg: '操作过于频繁，请稍后再试'
					})
				}
			}

			// 创建一个短信验证码
			const smskey = Control.createRandomNum(12, 36)

			// 创建一个防刷码
			const verifcode = Control.createRandomNum(6)

			await UserModel.update({
				_id: find._id
			}, {
				verifcode: verifcode,
				smskey: smskey,
				verifcodeTimeout: after30s
			})

			return ctx.success({
				data: {
					verifcode: verifcode,
					smskey: smskey,
				}
			})
		} catch(e) {
			return ctx.error()
		}
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

			if (!body.smskey) {
				return ctx.error({
					msg: '请获取短信验证码'
				})
			}

			if (!body.verifcode) {
				return ctx.error({
					msg: '请输入验证码'
				})
			}
			
			// 先找该用户
			const find = await UserModel.findOne({
				mobile: body.mobile,
				smskey: body.smskey
			})
			
			// 找到用户（如果发送过验证码，用户是一定在的）
			if (find) {

				if (find.verifcode !== body.verifcode) {
					return ctx.error({
						msg: '验证码错误'
					})
				}

				const now = new Date()
				
				// 过期时间为半小时
				const timeout = new Date(now.getTime() - 1000 * 60 * 30)

				if (find.verifcodeTimeout < timeout) {
					return ctx.error({
						msg: '验证码已过期'
					})
				}
				
				const userToken = Control.createRandomNum(12, 36)

				const updateinfo = {
					token: userToken,
					valid: true
				}
				
				// 如果是新用户
				if (!find.valid) {
					// 把createtime设置为当前
					updateinfo.createTime = now

					// 查找是不是有注册就给的优惠券
					const find = await CouponCon.getCouponAtRegisterSuccess()
					
					// 如果有找到可用的
					if (find.length) {
						updateinfo.$push = {
							couponList: {
								$each: find
							}
						}
					}
				}

				await UserModel.update({
					_id: find._id
				}, updateinfo)

				const token = jwt.sign({
			        mobile: body.mobile,
			        uid: find._id,
			        token: userToken
			    }, jwtKey)

				return ctx.success({
					data: {
						mobile: body.mobile,
						token
					}
				})
			}
		} catch(e) {
			return ctx.error()
		}
	}

	// 生成随机数
	static createRandomNum(len, str = 10) {
		const strNum = Math.round(Math.random() * 10000000000000000).toString(str)
		return strNum.substr(1, len)
	}
}

module.exports = Control