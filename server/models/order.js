var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var OrderSchema = Schema({
	// 订单号
	orderNo: {
		type: String,
		required: true
	},
	// 微信支付订单号
	wxOrderNo: {
		type: String,
		default: ''
	},
	// 用户id
	uid: {
		type: String,
		required: true,
		index: true // 按uid来作索引
	},
	// 城市，目前只能上海
	city: {
		type: String,
		default: '上海',
		enum: ['上海']
	},
	// 城市编号
	cityCode: {
		type: String,
		default: '310100'
	},
	// 邮编号码
	zipCode: {
		type: String,
		default: '200000'
	},
	// 收货人电话
	mobile: {
		type: String,
		required: true
	},
	// 收货人姓名
	name: {
		type: String,
		required: true
	},
	// 小区（地图选的）
	area: {
		type: String,
		required: true
	},
	// 经度
	lat: {
		type: Number,
		required: true
	},
	// 纬度
	lon: {
		type: Number,
		required: true
	},
	// 送货距离
	distance: {
		type: Number,
		required: true
	},
	// 收货人地址（门牌号部分）
	address: {
		type: String,
		required: true
	},
	// 商品
	goodsList: [{}],
	// 总重量
	totalWeight: {
		type: Number,
		default: 0
	},
	// 总价(不包含邮费)
	totalPrice: {
		type: Number,
		default: 0
	},
	// 满减
	discount: {
		type: Number,
		default: 0
	},
	// 满减名称
	discountName: {
		type: String,
		default: 0
	},
	// 优惠券减免
	coupon: {
		type: Number,
		default: 0
	},
	// 优惠券名称
	couponName: {
		type: String,
		default: 0
	},
	// 邮费
	postage: {
		type: Number,
		default: 0
	},
	// 需要支付
	needPayment: {
		type: Number,
		default: 0
	},
	// 状态 
	// 1: 待支付
	// 11: 已支付
	// 21: 已发货
	// 31: 已完成
	// 41: 已评价
	// 90: 交易关闭
	status: {
		type: Number,
		default: 1
	},
	// 订单状态备注(交易关闭时客服人员填写)
	statusMark: {
		type: String,
		default: ''
	},
	// 订单备注(客户下单时填写的)
	mark: {
		type: String,
		default: ''
	},
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	},
	// 支付时间
	paymentTime: {
		type: Date,
		default: ''
	},
	// 超时时间
	paymentTimeout: {
		type: Date,
		default: Date.now
	}
}, {
	toJSON: {
		virtuals: true
	}
})

// 计算超时时间
OrderSchema.virtual('paymentTimeoutSec').get(function() {
	// 如果是待支付的话，计算剩余支付时间
	let timeout = -1
	if (this.status === 1) {
		const now = new Date()
		timeout = Math.round((this.paymentTimeout.getTime() - now.getTime()) / 1000)
	}
    return timeout
})

const model = mongoose.model('Order', OrderSchema)
module.exports = model