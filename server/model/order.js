var mongoose = require('../conf/mongoose')

var Schema = mongoose.Schema

var OrderSchema = Schema({
	// 商品名称
	productName: {
		type: String,
		required: true
	},
	// 商品id
	productId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	// 订单号
	orderNo: {
		type: String,
		required: true
	},
	// 微信支付订单号
	wxOrderNo: {
		type: String,
	},
	// 城市，目前只能上海
	city: {
		type: String,
		default: '上海',
		enum: ['上海']
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
	// 收货人地址
	address: {
		type: String,
		required: true
	},
	// 状态 
	// 1: 待支付
	// 2: 已支付
	// 3: 已发货
	// 4: 已完成
	// 5: 已评价
	// 6: 交易关闭
	status: {
		type: Number,
		default: 1
	},
	// 订单状态备注(交易关闭时客服人员填写)
	statusMark: {
		type: String,
		default: ''
	},
	// 评论内容
	comment: {
		type: String,
		default: ''
	},
	// 评论时间
	commentTime: {
		type: Date,
		default: Date.now
	},
	// 打星
	star: {
		type: Number,
		default: 5
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
	}
})

module.exports = mongoose.model('Skill', OrderSchema)