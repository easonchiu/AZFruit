module.exports = function(app) {
	
	const {mongoose} = app

	// 创建一个schema实例
	const UploadSchema = new mongoose.Schema({
		id: { type: String },
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

	return mongoose.model('Upload', UploadSchema)
}