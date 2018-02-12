var OrderModel = require('../models/order')
var VerificationModel = require('../models/verification')
var UserModel = require('../models/user')
var CouponModel = require('../models/coupon')
var SkuModel = require('../models/sku')

class Control {

	// 获取订单列表
	static async fetchList(ctx, next) {
		try {
			// type: 1 等待处理的, 2 历史订单, 3 已发货的
			let { skip = 0, limit = 10, type = 1 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			type = parseInt(type)
			
			// 计算条目数量
			let count = 0
			// 等待处理的
			if (type == 1) {
				count = await OrderModel.count({
					status: 11
				})
			}
			// 已发货的
			else if (type == 3) {
				count = await OrderModel.count({
					status: 21
				})
			}
			// 等待发货的
			else if (type == 4) {
				count = await OrderModel.count({
					status: 20
				})
			}
			else {
				count = await OrderModel.history.count({})
			}
			
			// 查找数据
			let list = []
			if (count > 0) {
				// 等待处理的
				if (type == 1) {
					list = await OrderModel.aggregate([
						{ $match: { status: 11 } },
						{ $sort: { createTime: -1 } },
						{ $project: { _id: 0, __v: 0 } },
						{ $skip: skip },
						{ $limit: limit }
					])
				}
				// 已发货的
				else if (type == 3) {
					list = await OrderModel.aggregate([
						{ $match: { status: 21 } },
						{ $sort: { createTime: -1 } },
						{ $project: { _id: 0, __v: 0 } },
						{ $skip: skip },
						{ $limit: limit }
					])
				}
				// 等待发货的
				else if (type == 4) {
					list = await OrderModel.aggregate([
						{ $match: { status: 20 } },
						{ $sort: { createTime: -1 } },
						{ $project: { _id: 0, __v: 0 } },
						{ $skip: skip },
						{ $limit: limit }
					])
				}
				else {
					list = await OrderModel.history.aggregate([
						{ $sort: { createTime: -1 } },
						{ $project: { _id: 0, __v: 0 } },
						{ $skip: skip },
						{ $limit: limit }
					])
				}
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

	// 设置订单状态
	static async updateStatus(ctx, next) {
		try {
			const orderNo = ctx.params.orderNo
			
			// 查询相关的订单
			const doc = await OrderModel.findOne({
				orderNo
			}, {
				_id: 0,
				__v: 0,
			})

			if (!doc) {
				return ctx.error({
					msg: '该订单不存在'
				})
			}
			
			// 获取参数并验证
			const body = ctx.request.body
			
			// 只可以关闭、发货、等待发货
			if (body.status !== 90 && body.status !== 21 && body.status !== 20) {
				return ctx.error({
					msg: 'status参数错误'
				})
			}
			else if (body.status === 90 && body.statusMark === '') {
				return ctx.error({
					msg: 'statusMark不能为空'
				})
			}
			else {
				// 操作表
				if (body.status === 20 || body.status === 21) {
					await OrderModel.update({
						orderNo
					}, {
						$set: {
							status: body.status,
							statusMark: body.statusMark
						}
					})
				}
				// 转移表
				else {
					// 修改状态并存入历史表中
					doc._doc.status = body.status
					await new OrderModel.history(doc._doc).create()

					// 删除原来表中的数据
					await OrderModel.remove({
						orderNo
					})

					// 如果是关闭订单
					if (body.status === 90) {
						// 恢复coupon
						if (doc.coupon && doc.coupon.id) {
							await UserModel.resetCoupon(doc.uid, doc.coupon.id)
							await VerificationModel.remove({
								cid: doc.coupon.id
							})
						}

						// 减掉销量，返还库存
						if (doc.list) {
							await SkuModel.resetStock(doc.list)
						}
					}
				}
				
				// 返回成功
				return ctx.success()
			}
		} catch(e) {
			console.log(e)
			return ctx.error()
		}
	}
	
	// 获取订单详情
	static async fetchDetail(ctx, next) {
		try {
			const orderNo = ctx.params.orderNo
			
			// 查询相关的订单
			let res = await OrderModel.findOne({
				orderNo
			}, {
				_id: 0,
				__v: 0
			})
			
			// 如果在order表中找不到，再去history表中找找，history表更多，所以找不到再找它
			if (!res) {
				res = await OrderModel.history.findOne({
					orderNo
				}, {
					_id: 0,
					__v: 0
				})
			}
			
			// 如果有找到，返回
			if (res) {
				return ctx.success({
					data: res
				})
			}
			else {
				return ctx.error({
					msg: '找不到相关订单'
				})
			}
		}
		catch (e) {
			return ctx.error()
		}
	}
	
	// 设置订单状态为已支付
	static orderFinishPayment(orderNo, wxOrderNo) {
		return new Promise(async (resolve, reject) => {
			let doc = await OrderModel.findOne({
				orderNo
			})
			
			// 找到这个订单
			if (!doc) {
				return reject('未找到相关订单')
			}
			// 订单状态不正常
			else if (doc.status != 1) {
				return reject('订单状态不正常')
			}

			// 更新原表中的订单
			await OrderModel.update({
				orderNo
			}, {
				$set: {
					// 查找相关的订单将其改成支付完成状态
					status: 11,
					// 把微信订单号存进来
					wxOrderNo: wxOrderNo,
					// 把支付时间存下来
					paymentTime: new Date()
				}
			})

			// 如果有优惠券，把这张券改为已使用
			if (doc.coupon) {
				await UserModel.useCoupon(doc.uid, doc.coupon.id)
				
				// 在核销表中存入信息
				const find = await VerificationModel.findOne({
					cid: doc.coupon.id
				})
				
				if (!find) {
					await new VerificationModel({
						cid: doc.coupon.id,
						originId: doc.coupon.originId,
						userId: doc.uid,
						orderNo: orderNo,
						couponName: doc.coupon.name,
						couponBatch: doc.coupon.batch,
						couponCondition: doc.coupon.condition,
						couponWorth: doc.coupon.worth
					}).create()

					// 在券表中已使用计数器+1
					await CouponModel.countUsed(doc.coupon.originId)
				}
			}

			// 遍历用户购买的商品，在库存表中减掉他们，并在销量中加上
			if (doc.list && doc.list.length) {
				await SkuModel.sellStock(doc.list)
			}

			// 给用户增加积分
			await UserModel.update({
				_id: doc.uid
			}, {
				$inc: {
					integral: doc.paymentPrice || 0
				}
			})

			resolve()
		})
	}
}

module.exports = Control