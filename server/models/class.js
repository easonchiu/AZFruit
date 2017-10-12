var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var ClassSchema = Schema({
	// 分类名
	name: {
		type: String,
		required: true
	},
	// 是否使用中
	online: {
		type: Boolean,
		defaut: true
	},
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

module.exports = mongoose.model('Class', ClassSchema)