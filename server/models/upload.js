var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var UploadSchema = Schema({
	id: { type: Schema.Types.ObjectId },
	// 名称
	name: { type: String, required: true },
	// 地址
	uri: { type: String, required: true },
	// 归类
	class: { type: String, default: '' },
	// 创建时间
	createTime: { type: Date, default: Date.now }
})

// 创建
UploadSchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

const model = mongoose.model('Upload', UploadSchema)
module.exports = model