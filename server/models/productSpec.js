var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var ProductSpecSchema = Schema({
	// 排序
	index: {
		type: Number,
		default: 0
	},
	// 所属产品
	pid: {
		type: String,
		required: true
	},
	// 规格描述
	desc: {
		type: String,
		default: ''
	},
	// 库存
	stock: {
		type: Number,
		default: 0
	},
	// 计量单位
	unit: {
		type: String,
		required: true
	},
	// 重量，单位克
	weight: {
		type: Number,
		default: ''
	},
	// 价格
	price: {
		type: Number,
		default: 0
	},
	// 原价
	prePrice: {
		type: Number,
		default: 0
	},
	// 上下架
	online: {
		type: Boolean,
		default: false
	},
	// 销量
	sellCount: {
		type: Number,
		default: 0
	},
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('ProductSpec', ProductSpecSchema)