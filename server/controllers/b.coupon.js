var jwt = require('jsonwebtoken')
var mongoose = require('../conf/mongoose')

var UserModel = require('../models/user')
var CouponModel = require('../models/coupon')

class Control {

	// 创建
	static async create(ctx, next) {
		try {

			// 检查body的参数
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
			
			// 先检查是否有相同的批次号
			const findDoc = await CouponModel.findOne({
				batch: body.batch
			})
				
			// 如果有，不允许重复插入
			if (findDoc) {
				return ctx.error({
					msg: '批次号不能重复'
				})
			}
			
			// 创建并返回成功
			const doc = {
				name: body.name,
				flag: body.flag,
				batch: body.batch,
				amount: body.amount,
				worth: body.worth * 100, // 优惠券价值
				condition: body.condition * 100, // 优惠券使用条件，即满足多少钱
				expiredTime: body.expiredTime, // 过期时间，n天
				online: !!body.online
			}

			await new CouponModel(doc).create()

			return ctx.success()
		}
		catch (e) {
			return ctx.error()
		}
	}

	// 获取列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 计算条目数量
			const count = await CouponModel.count({})
			
			// 查找数据
			let list = []
			if (count > 0) {
				list = await CouponModel.aggregate([
					{ $sort: { online: -1, createTime: 1 } },
					{ $project: { _id: 0, __v: 0 } },
					{ $skip: skip },
					{ $limit: limit }
				])
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
					msg: '找不到该优惠券'
				})
			}
		} catch(e) {
			return ctx.error()
		}
	}

	// 更新（只支持是否使用中的更新）
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

	
}

module.exports = Control