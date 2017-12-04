var jwt = require('jsonwebtoken')

var UserModel = require('../models/user')
var CouponModel = require('../models/coupon')

class Control {
	// 获取列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await CouponModel.count({})
			let list = []

			if (count > 0) {
				list = await CouponModel
					.aggregate([{
						$sort: {
							online: -1,
							createTime: 1,
						}
					}, {
						$project: {
							_id: 0,
							name: 1,
							batch: 1,
							amount: 1,
							handOutAmount: 1,
							usedAmount: 1,
							worth: 1,
							condition: 1,
							flag: 1,
							online: 1,
							expiredTime: 1,
							id: '$_id'
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
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 用户获取列表
	static async appFetchList(ctx, next) {
		try {
			const {uid} = ctx.state.jwt
			
			// 查找用户的地址表
			const find = await UserModel.findOne({
				_id: uid
			}, {
				couponList: 1
			})
			
			// 如果没找到，返回空数据
			if (!find) {
				return ctx.success({
					data: {
						list: []
					}
				})
			}
			
			// 找到，返回数据
			ctx.success({
				data: {
					list: find.couponList,
				}
			})
		}
		catch(e) {
			ctx.error()
		}
	}

	// 获取详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await CouponModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})

			if (res) {
				return ctx.success({
					data: res
				})
			}
			else {
				return ctx.error({
					msg: '找不到该商品'
				})
			}
		} catch(e) {
			return ctx.error()
		}
	}

	// 创建
	static async create(ctx, next) {
		try {
			const body = ctx.request.body

			if (!body.name) {
				return ctx.error({
					msg: '优惠券名称不能为空'
				})
			}
			else if (!body.batch) {
				return ctx.error({
					msg: '优惠券批次号不能为空'
				})
			}
			else if (body.amount == undefined || body.amount <= 0) {
				return ctx.error({
					msg: '预设数量必须大于0'
				})
			}
			else if (body.worth == undefined || body.worth <= 0) {
				return ctx.error({
					msg: '可抵扣金额必须大于0'
				})
			}
			else if (body.condition == undefined || body.condition < 0) {
				return ctx.error({
					msg: '使用条件必须大于等于0'
				})
			}
			else if (!body.flag) {
				return ctx.error({
					msg: '请选择发放方式'
				})
			}
			else if (body.expiredTime == undefined || body.expiredTime < 0) {
				return ctx.error({
					msg: '过期期限必须大于0天'
				})
			}

			const find = await CouponModel.findOne({
				batch: body.batch
			})

			if (find) {
				return ctx.error({
					msg: '批次号不能重复'
				})
			}
			
			const res = await CouponModel.create({
				name: body.name,
				flag: body.flag,
				batch: body.batch,
				amount: body.amount,
				payment: body.payment,
				worth: body.worth,
				condition: body.condition,
				expiredTime: body.expiredTime,
				online: !!body.online
			})

			console.log(res)
			
			if (res) {
				return ctx.success()
			}
			else {
				return ctx.error()
			}
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 更新
	static async update(ctx, next) {
		try {
			const body = ctx.request.body

			if (!body.id) {
				return ctx.error({
					msg: 'id不能为空'
				})
			}
			
			const res = await CouponModel.update({
				_id: body.id
			}, {
				online: !!body.online
			})
			
			if (res) {
				return ctx.success()
			}
			else {
				return ctx.error()
			}
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 注册完成时获得优惠券
	// 注意：调用这个方法会自动加上领取量
	static getCouponAtRegisterSuccess() {
		return new Promise(async resolve => {
			// 获取下单即获取的优惠券
			const res = await CouponModel.find({
				flag: 1,
				online: true
			}, {
				__v: 0
			})
			
			// 声明结果数组
			const list = []

			// 处理优惠券
			for (let i = 0; i < res.length; i++) {
				const data = res[i]

				// 如果还有没发完的优惠券，给该用户
				if (data.handOutAmount < data.amount) {
					const expiredTime = (new Date().getTime()) + 60 * 60 * 1000 * 24 * data.expiredTime
					list.push({
						name: data.name,
						batch: data.batch + '_' + (data.handOutAmount + 1),
						condition: data.condition,
						worth: data.worth,
						expiredTime: new Date(expiredTime),
					})

					// 已发放数量+1
					// 如果是最后一张优惠券，停用它
					await CouponModel.update({
						_id: data._id
					}, {
						$inc: {
							handOutAmount: 1
						},
						$set: {
							online: data.amount > data.handOutAmount + 1
						}
					})
				}
				// 否则停用它
				else {
					await CouponModel.update({
						_id: data._id
					}, {
						$set: {
							online: false
						}
					})
				}
			}

			console.log(list)

			resolve(list)
		})
	}
}

module.exports = Control