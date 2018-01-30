var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var CategorySchema = Schema({
	id: { type: String },
	// 分类名
	name: { type: String, required: true },
	// 是否使用中
	online: { type: Boolean, defaut: true },
	// 标签
	badge: { type: String, default: '' },
	// 标签底色
	badgeColor: { type: String, default: '' },
	// 排序
	index: { type: Number, required: true },
})

// 创建
CategorySchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

const model = mongoose.model('Category', CategorySchema)
module.exports = model