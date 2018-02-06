var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var VerificationSchema = Schema({
	// cid 同用户表里的优惠券id
	cid: { type: String, index: true },
	// 优惠券表中对应的id
	originId: { type: String },
	// 用户
	userId: { type: String },
	// 相关联的订单号
	orderNo: { type: String, required: true },
	// 优惠券名称
	couponName: { type: String, required: true },
	// 批次号
	couponBatch: { type: String, required: true },
	// 价值，即可抵扣金额
	couponWorth: { type: Number, default: 0 },
	// 条件
	couponCondition: { type: Number, default: 0 },
	// 使用时间
	createTime: { type: Date, default: Date.now }
})

// 创建
VerificationSchema.methods.create = function() {
	return this.save()
}

const model = mongoose.model('Verification', VerificationSchema)
module.exports = model