var mongoose = require('../conf/mongoose')

var Schema = mongoose.Schema

var BannerSchema = Schema({
	// 描述
	desc: {
		type: String,
		default: ''
	},
	// 图片地址
	uri: {
		type: String,
		required: true
	},
	// 图片链接
	link: {
		type: String,
		default: ''
	},
	// 是否上架中
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

module.exports = mongoose.model('Banner', BannerSchema)