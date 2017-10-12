var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var QuickSchema = Schema({
	// 描述
	desc: {
		type: String,
		default: ''
	},
	// 图标地址
	uri: {
		type: String,
		required: true
	},
	// 链接
	link: {
		type: String,
		required: true
	},
	// 是否使用中
	online: {
		type: Boolean,
		defaut: true
	},
	// 排序
	index: {
		type: Number,
		required: true
	},
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Quick', QuickSchema)