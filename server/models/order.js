
var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var OrderSchema = Schema({
	id: { type: Schema.Types.ObjectId },
	// 订单号
	orderNo: { type: String, required: true, index: true },
	// 微信支付订单号
	wxOrderNo: { type: String, default: '' },
	// 用户id
	uid: { type: String, required: true },
	// 用户openId
	openId: { type: String, required: true },
	// 收货人信息
	address: { type: Object, required: true },
	// 优惠券信息
	coupon: { type: Object },
	// 商品
	list: [{}],
	// 总重量
	totalWeight: { type: Number, default: 0 },
	// 总价
	totalPrice: { type: Number, default: 0 },
	// 支付金额（商品总价+运费-优惠券）
	paymentPrice: { type: Number, default: 0 },
	// 邮费
	postage: { type: Number, default: 0 },
	// 状态 
	// 1: 待支付
	// 11: 已支付
	// 21: 已发货
	// 31: 已完成
	// 41: 已评价
	// 90: 交易关闭
	status: { type: Number, default: 1 },
	// 订单状态备注(交易关闭时客服人员填写)
	statusMark: { type: String, default: '' },
	// 订单备注(客户下单时填写的)
	mark: { type: String, default: '' },
	// 创建时间
	createTime: { type: Date, default: Date.now },
	// 支付时间
	paymentTime: { type: Date, default: '' },
	// 超时时间
	paymentTimeout: { type: Date, default: Date.now }
})

// 创建
OrderSchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

const model = mongoose.model('Order', OrderSchema)
model.history = mongoose.model('HistoryOrder', OrderSchema)
module.exports = model