var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var BannerSchema = Schema({
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


BannerSchema.statics.test = function () {
	return this.aggregate([
		{ $sort: { online: 1 } }
	]).then(res => {
		if (!res || res.length === 0) return Promise.reject()
		return Promise.resolve(res)
	}).catch(err => Promise.reject(err))
}


const model = mongoose.model('Banner', BannerSchema)
module.exports = model
