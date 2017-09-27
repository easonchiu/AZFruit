var mongoose = require('../conf/mongoose')

var Schema = mongoose.Schema

var ProductSchema = Schema({
	// 商品名称
	name: {
		type: String,
		required: true
	},
	// 商品价格，单位为分
	price: {
		type: Number,
		default: 0,
		required: true
	},
	// 商品描述
	desc: {
		type: String,
	},
	// 售卖量
	sellCount: {
		type: Number,
		default: 0
	},
	// 留言列表
	commentList: [{
		// 留言内容
		comment: {
			type: String,
			default: ''
		},
		// 留言时间
		commentTime: {
			type: Date,
			default: Date.now
		},
		// 用户名
		name: {
			type: String,
			default: ''
		},
		// 头像
		header: {
			type: String,
			default: ''
		},
		// 打星
		star: {
			type: Number,
			default: 5
		}
	}],
	// 是否上架中
	online: {
		type: Boolean,
		default: false
	},
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Product', ProductSchema)