module.exports = function(app) {
	
	const {mongoose} = app

	// 创建一个schema实例
	const BannerSchema = new mongoose.Schema({
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
		index: { type: Number, default: 0 },
	})
	
	// 创建
	BannerSchema.methods.create = function() {
		this.id = this._id
		return this.save()
	}

	return mongoose.model('Banner', BannerSchema)
}