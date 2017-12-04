var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var CouponSchema = Schema({
	// 名称
	name: {
		type: String,
		required: true
	},
	// 批次号
	batch: {
		type: String,
		required: true
	},
	// 数量
	amount: {
		type: Number,
		default: 0
	},
	// 已发放数量
	handOutAmount: {
		type: Number,
		default: 0
	},
	// 已使用数量
	usedAmount: {
		type: Number,
		default: 0
	},
	// 价值，即可抵扣金额
	worth: {
		type: Number,
		default: 0
	},
	// 使用条件，满足金额数
	condition: {
		type: Number,
		default: 0
	},
	// 发放方式
	flag: {
		type: Number,
		default: 0
	},
	// 是否使用中
	online: {
		type: Boolean,
		default: false
	},
	// 过期时间，（几天后过期）
	expiredTime: {
		type: Number
	},
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	}
})

const model = mongoose.model('Coupon', CouponSchema)
module.exports = model