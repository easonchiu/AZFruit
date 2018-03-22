module.exports = function(app) {
	
	const {mongoose} = app

	// 创建一个schema实例
	const PostageSchema = new mongoose.Schema({
		id: { type: String },
		// 超出公里数
		km: { type: Number, required: true },
		// 重量多少以内
		weight: { type: Number, required: true },
		// 运费
		postage: { type: Number, required: true },
		// 递增重量
		eachWeight: { type: Number, default: 500 },
		// 每递增eachWeight增加多少钱
		eachPostage: { type: Number, default: 200 },
		// 满消费免运费
		freePostage: { type: Number, default: 999999 },
		// 使用中
		online: { type: Boolean, default: false },
		// 创建时间
		createTime: { type: Date, default: Date.now }
	})
	
	// 创建
	PostageSchema.methods.create = function() {
		this.id = this._id
		return this.save()
	}

	return mongoose.model('Postage', PostageSchema)
}