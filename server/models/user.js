var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var UserSchema = Schema({
	// 姓名
	name: {
		type: String,
		required: true
	},
	// 头像
	header: {
		type: String,
		default: ''
	},
	// 微信openid
	openId: {
		type: String,
		required: true
	},
	// 绑定的手机号
	mobile: {
		type: String,
		default: ''
	},
	// 收货地址列表
	addressList: [{
		// 城市，目前只能上海
		city: {
			type: String,
			default: '上海',
			enum: ['上海']
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
		// 收货人地址
		address: {
			type: String,
			required: true
		},
		// 描述
		desc: {
			type: String,
			default: ''
		},
		// 是否默认
		def: {
			type: Boolean,
			default: false
		}
	}],
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('User', UserSchema)