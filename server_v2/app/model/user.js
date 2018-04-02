module.exports = function(app) {
	
	const {mongoose} = app
	
	// 用户表的骨架
	const schema = {
		id: { type: String, default: '' },
		// 微信openid
		openId: { type: String, default: '' },
		// 绑定的手机号
		mobile: { type: String, required: true },
		// 有效用户，首次登录并验证通过便认为是有效用户
		valid: { type: Boolean, default: false },
		// 积分
		integral: { type: Number, default: 0 },
		// 创建时间, index: 按创建时间来作索引
		createTime: { type: Date, default: Date.now, index: true },
		// 用户的默认地址id
		defaultAddress: { type: String, default: '' }
	}

	// 地址信息
	schema.addressList = [mongoose.Schema({
		id: { type: String },
		// 城市，目前只能上海
		city: { type: String, default: '上海', enum: ['上海'], required: true },
		// 城市编号
		cityCode: { type: String, default: '310100' },
		// 邮编号码
		zipCode: { type: String, default: '200000' },
		// 收货人电话
		mobile: { type: String, required: true },
		// 收货人姓名
		name: { type: String, required: true },
		// 小区（地图选的）
		area: { type: String, required: true },
		// 小区地址（地图选的）
		areaAddress: { type: String, required: true },
		// 经度
		lat: { type: Number, required: true },
		// 纬度
		lon: { type: Number, required: true },
		// 直线距离
		distance: { type: Number, required: true },
		// 收货人地址（门牌号部分）
		address: { type: String, required: true }
	}, { _id: false })]

	// 优惠券信息
	schema.couponList = [mongoose.Schema({
		id: { type: String },
		// 源id，就是这张券在券表中的id
		originId: { type: String },
		// 优惠券名称
		name: { type: String, default: '' },
		// 批次+id
		batch: { type: String },
		// 可抵扣金额
		worth: { type: Number, default: 0 },
		// 使用条件
		condition: { type: Number, default: 9999 },
		// 过期时间
		expiredTime: { type: Date, default: Date.now },
		// 是否已使用
		used: { type: Boolean, default: false }
	}, { _id: false })]

	// 购物车信息
	schema.shoppingcart = [mongoose.Schema({
		// 产品规格id
		skuId: { type: String, required: true, ref: 'Sku' },
		// 产品id
		pid: { type: String, required: true, ref: 'Product' },
		// 产品名称
		name: { type: String, required: true },
		// 规格名称
		skuName: { type: String, default: '' },
		// 封面图
		cover: { type: String, required: true },
		// 数量
		amount: { type: Number, default: 0, require: true },
		// 重量(单份)
		weight: { type: Number, default: 0, require: true },
		// 总重量(数量 x 单份重量)
		totalWeight: { type: Number, default: 0, require: true },
		// 是否上架中
		online: { type: Boolean, default: true },
		// 价格(单价)
		price: { type: Number, required: true },
		// 小计(单价 x 数量)
		totalPrice: { type: Number, required: true },
		// 单位
		unit: { type: String, required: true },
		// 库存
		stock: { type: Number, required: true },
	}, { _id: false })]

	// 创建一个schema实例
	const UserSchema = new mongoose.Schema(schema)
	
	// 创建
	UserSchema.methods.create = function() {
		this.id = this._id
		return this.save()
	}

	return mongoose.model('User', UserSchema)
}