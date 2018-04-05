module.exports = function(app) {
	
	const {mongoose} = app

	// 创建一个schema实例
	const CouponSchema = new mongoose.Schema({
		id: { type: String },
		// 名称
		name: { type: String, required: true },
		// 批次号
		batch: { type: String, required: true },
		// 已发放数量
		handOutAmount: { type: Number, default: 0 },
		// 已使用数量
		usedAmount: { type: Number, default: 0 },
		// 价值，即可抵扣金额
		worth: { type: Number, default: 0 },
		// 使用条件，满足金额数
		condition: { type: Number, default: 0 },
		// 发放方式
		flag: { type: Number, default: 0 },
		// 是否使用中
		online: { type: Boolean, default: false },
		// 过期时间，（几天后过期）
		expiredTime: { type: Number },
		// 创建时间
		createTime: { type: Date, default: Date.now }
	})
	
	// 创建
	CouponSchema.methods.create = function() {
		this.id = this._id
		return this.save()
	}

	return mongoose.model('Coupon', CouponSchema)
}