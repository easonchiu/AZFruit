var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 用户的基本信息
const user = {
	// 微信openid
	openId: {
		type: String,
		default: ''
	},
	// 绑定的手机号
	mobile: {
		type: String,
		required: true
	},
	// 短信key，发送验证码后返回，在提交时带上，防刷验证码用
	smskey: {
		type: String,
		default: ''
	},
	// 短信验证码
	verifcode: {
		type: String,
		default: ''
	},
	// 短信验证码过期时间
	verifcodeTimeout: {
		type: Date,
		default: Date.now
	},
	// token
	token: {
		type: String,
		default: ''
	},
	// 有效用户，首次登录并验证通过便认为是有效用户
	valid: {
		type: Boolean,
		default: false
	},
	// 积分
	integral: {
		type: Number,
		default: 0
	},
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now,
		index: true // 按创建时间来作索引
	}
}


// 用户的地址信息
user.defaultAddress = {
	type: String,
	default: ''
}
user.addressList = [{
	// 城市，目前只能上海
	city: {
		type: String,
		default: '上海',
		enum: ['上海'],
		required: true
	},
	// 城市编号
	cityCode: {
		type: String,
		default: '310100'
	},
	// 邮编号码
	zipCode: {
		type: String,
		default: '200000'
	},
	// 收货人电话
	mobile: {
		type: String,
		required: true
	},
	// 收货人姓名
	name: {
		type: String,
		required: true
	},
	// 小区（地图选的）
	area: {
		type: String,
		required: true
	},
	// 小区地址（地图选的）
	areaAddress: {
		type: String,
		required: true
	},
	// 经度
	lat: {
		type: Number,
		required: true
	},
	// 纬度
	lon: {
		type: Number,
		required: true
	},
	// 直线距离
	distance: {
		type: Number,
		required: true
	},
	// 收货人地址（门牌号部分）
	address: {
		type: String,
		required: true
	}
}]

// 优惠券信息
user.couponList = [{
	// 优惠券名称
	name: {
		type: String,
		default: '',
	},
	// 批次+id
	batch: {
		type: String
	},
	// 可抵扣金额
	worth: {
		type: Number,
		default: 0
	},
	// 使用条件
	condition: {
		type: Number,
		default: 9999
	},
	// 过期时间
	expiredTime: {
		type: Date,
		default: Date.now
	},
	// 是否已使用
	used: {
		type: Boolean,
		default: false
	}
}]

// 创建一个schema实例
var UserSchema = Schema(user)

const model = mongoose.model('User', UserSchema)
module.exports = model