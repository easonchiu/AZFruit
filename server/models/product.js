var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var ProductSchema = Schema({
	// 商品名称
	name: {
		type: String,
		required: true
	},
	// 顶图片
	imgs: [{
		type: String,
		default: ''
	}],
	// 商品价格，单位为分
	price: {
		type: Number,
		default: 0,
		required: true
	},
	// 排序
	index: {
		type: Number,
		default: 0
	},
	// 整箱价格
	FCLprice: {
		type: Number,
		default: 0
	},
	// 商品描述
	desc: {
		type: String,
		default: ''
	},
	// 计量单位
	unit: {
		type: String,
		required: true
	},
	// 整箱数量
	FCLcount: {
		type: String,
		default: ''
	},
	// 售卖量
	sellCount: {
		type: Number,
		default: 0
	},
	// 整箱售卖量
	FCLsellCount: {
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
		createTime: {
			type: Date,
			default: Date.now
		},
		// 用户id
		userId: {
			type: Schema.Types.ObjectId,
			required: true
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
	// 整箱上架中
	FCLonline: {
		type: Boolean,
		default: false
	},
	// 库存
	stock: {
		type: Number,
		default: 0
	},
	// 整箱库存
	FCLstock: {
		type: Number,
		default: 0
	},
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Product', ProductSchema)