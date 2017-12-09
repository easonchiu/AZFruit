var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/clientJwtKey')

var UserModel = require('../models/user')
var CouponCon = require('./coupon')
var isMobile = require('../utils/reg').isMobile
var Sms = require('../utils/sms')

class Control {
	// 获取用户列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 获取总用户数
			const count = await UserModel.count({})
			
			// 初始化用户列表
			let list = []
			
			// 如果有数据
			if (count > 0) {

				// 查找用户数据
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
			
			// 返回成功
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

			if (!isMobile(body.mobile)) {
				return ctx.error({
					msg: '请输入正确的手机手机号码'
				})
			}

			// 先找该用户
			let $user = await UserModel.findOne({
				mobile: body.mobile
			})

			// 如果是新用户
			if (!$user) {
				$user = await UserModel.create({
					mobile: body.mobile,
					verifcodeTimeout: after30s
				})
			} else {
				const timeout = $user.verifcodeTimeout

				// 短信验证码发送间隔时间未过
				if (timeout > now) {
					return ctx.error({
						msg: '操作过于频繁，请稍后再试'
					})
				}
			}

			// 创建一个防刷码
			const smskey = String(Math.random() * 10000)

			// 创建一个短信验证码并发给用户
			const verifcode = await Sms.sendVerifcode($user.mobile)

			// 更新用户表
			await UserModel.update({
				_id: $user._id
			}, {
				verifcode: verifcode,
				smskey: smskey,
				verifcodeTimeout: after30s
			})
			
			// 返回成功
			return ctx.success({
				data: {
					smskey: smskey
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

			if (!isMobile(body.mobile)) {
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
			const $user = await UserModel.findOne({
				mobile: body.mobile,
				smskey: body.smskey
			})
			
			// 找到用户（如果发送过验证码，用户是一定在的）
			if ($user) {
				
				// 先判断验证码是否正确
				if ($user.verifcode !== body.verifcode) {
					return ctx.error({
						msg: '验证码错误'
					})
				}
				
				// 获取系统时间
				const now = new Date()
				
				// 过期时间为半小时
				const timeout = new Date(now.getTime() - 1000 * 60 * 30)

				if ($user.verifcodeTimeout < timeout) {
					return ctx.error({
						msg: '验证码已过期'
					})
				}
				
				// 初始化需要更新的用户信息
				const updateinfo = {}
				
				// 如果是新用户
				if (!$user.valid) {
					// 把createtime设置为当前
					updateinfo.createTime = now

					// 查找是不是有注册就给的优惠券
					const coupons = await CouponCon.getCouponAtRegisterSuccess()
					
					// 如果有找到可用的，给该用户
					if (coupons.length) {
						updateinfo.$push = {
							couponList: {
								$each: coupons
							}
						}
					}
				}

				// 清空短信验证码
				updateinfo.verifcode = ''
				updateinfo.smskey = ''

				// 设置为有效用户
				updateinfo.valid = true

				// 添加token(暂时无用)
				const userToken = String(Math.random() * 10000)
				updateinfo.token = userToken
				
				// 更新用户表
				await UserModel.update({
					_id: $user._id
				}, updateinfo)

				// 生成jwt
				const token = jwt.sign({
			        mobile: body.mobile,
			        uid: $user._id,
			        token: userToken
			    }, jwtKey)
				
				// 返回成功
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

}

module.exports = Control