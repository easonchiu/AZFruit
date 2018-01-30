var OrderModel = require('../models/order')
var VerificationModel = require('../models/verification')
var UserModel = require('../models/user')
var CouponModel = require('../models/coupon')
var SkuModel = require('../models/sku')

class Control {

	// 获取订单列表
	static async fetchList(ctx, next) {
		try {
			// type: 1 等待处理的，2 历史订单
			let { skip = 0, limit = 10, type = 1 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 计算条目数量
			let count = 0
			if (type == 1) {
				// 只查找已经支付的，待支付的无视
				count = await OrderModel.count({
					status: 11
				})
			}
			else {
				count = await OrderModel.history.count({})
			}
			
			// 查找数据
			let list = []
			if (count > 0) {
				if (type == 1) {
					list = await OrderModel.aggregate([
						{ $match: { status: 11 } },
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
	
	// 获取订单详情
	static async fetchDetail(ctx, next) {
		try {
			const id = ctx.params.id
			
			// 查询相关的订单
			let res = await OrderModel.findOne({
				_id: id
			}, {
				_id: 0,
				__v: 0
			})
			
			// 如果在order表中找不到，再去history表中找找，history表更多，所以找不到再找它
			if (!res) {
				res = await OrderModel.history.findOne({
					_id: id
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
				orderNo: orderNo
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
				orderNo: orderNo
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
				await UserModel.usedCoupon(doc.uid, doc.coupon.id)
				
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

			resolve()
		})
	}
}

module.exports = Control