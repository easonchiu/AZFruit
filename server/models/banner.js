var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var BannerSchema = Schema({
	id: { type: String },
	// 描述
	desc: { type: String, default: '' },
	// 图片地址
	uri: { type: String, required: true },
	// 图片链接
	link: { type: String, default: '' },
	// 是否上架中
	online: { type: Boolean, defaut: true },
	// 排序
	index: { type: Number, required: true },
})

// 创建
BannerSchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

const model = mongoose.model('Banner', BannerSchema)
module.exports = model
