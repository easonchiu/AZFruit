var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 用户的基本信息
const user = {
	// 微信openid
	openId: { type: String, default: '' },
	// 绑定的手机号
	mobile: { type: String, required: true },
	// 短信key，发送验证码后返回，在提交时带上，防刷验证码用
	smskey: { type: String, default: '' },
	// 短信验证码
	verifcode: { type: String, default: '' },
	// 短信验证码过期时间
	verifcodeTimeout: { type: Date, default: Date.now },
	// token
	token: { type: String, default: '' },
	// 有效用户，首次登录并验证通过便认为是有效用户
	valid: { type: Boolean, default: false },
	// 积分
	integral: { type: Number, default: 0 },
	// 创建时间, index: 按创建时间来作索引
	createTime: { type: Date, default: Date.now, index: true },
	// 用户的默认地址id
	defaultAddress: { type: String, default: '' }
}


// 地址表
user.addressList = [Schema({
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
user.couponList = [Schema({
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
	used: { type: Boolean, default: false },
	// 是否被锁了
	locked: { type: Boolean, default: false }
}, { _id: false })]

// 创建购物车的schema实例
user.shoppingcart = [Schema({
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
var UserSchema = Schema(user)


// 将coupon改为已使用
UserSchema.statics.useCoupon = function(uid, cid) {
	return new Promise(async (resolve, reject) => {
		await this.update({
			_id: uid,
			'couponList.id': cid
		}, {
			'couponList.$.used': true,
			'couponList.$.locked': false,
		})
		resolve()
	})
}

// 将coupon锁定
UserSchema.statics.lockCoupon = function(uid, cid) {
	return new Promise(async (resolve, reject) => {
		await this.update({
			_id: uid,
			'couponList.id': cid
		}, {
			'couponList.$.used': false,
			'couponList.$.locked': true,
		})
		resolve()
	})
}

// 将coupon恢复
UserSchema.statics.resetCoupon = function(uid, cid) {
	return new Promise(async (resolve, reject) => {
		await this.update({
			_id: uid,
			'couponList.id': cid
		}, {
			'couponList.$.used': false,
			'couponList.$.locked': false,
		})
		resolve()
	})
}

const model = mongoose.model('User', UserSchema)
module.exports = model