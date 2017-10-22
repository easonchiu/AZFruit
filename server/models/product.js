var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var ProductSchema = Schema({
	// 产品名称
	name: {
		type: String,
		required: true
	},
	// 排序
	index: {
		type: Number,
		required: true
	},
	// 产品描述
	desc: {
		type: String,
		default: ''
	},
	// 封面图
	cover: {
		type: String,
		default: ''
	},
	// 参数
	parameter: [{
		name: {
			type: String,
			default: ''
		},
		value: {
			type: String,
			default: ''
		}
	}],
	// 是否进口
	isImport: {
		type: Boolean,
		default: false
	},
	// 产地
	origin: {
		type: String,
		default: ''
	},
	// 所属分类
	category: [{
		name: {
			type: String,
			default: ''
		},
		id: {
			type: String,
			default: ''
		}
	}],
	// 标签
	badge: {
		type: String,
		default: ''
	},
	// 标签底色
	badgeColor: {
		type: String,
		default: ''
	},
	// 产品轮播图
	imgs: [{
		type: String,
		default: ''
	}],
	// 详情
	detail: {
		type: String,
		default: ''
	},
	// 首页推荐
	atIndex: {
		type: Boolean,
		default: false
	},
	// 上下架
	online: {
		type: Boolean,
		default: false
	},
	// 有库存并上架中的规格数量
	specCount: {
		type: Number,
		default: 0
	},
	// 销量，所有规格销量相加
	sellCount: {
		type: Number,
		default: 0
	},
	// 规格中价格最低的存入
	price: {
		type: Number,
		default: 0
	},
	// 规格中价格最低的存入
	prePrice: {
		type: Number,
		default: 0
	},
	// 规格中价格最低的存入
	unit: {
		type: String,
		default: ''
	},
	// 销量，这里的销量即所有规格的总和
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

module.exports = mongoose.model('Product', ProductSchema)