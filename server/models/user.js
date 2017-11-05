var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var UserSchema = Schema({
	// 姓名
	name: {
		type: String,
		default: ''
	},
	// 头像
	header: {
		type: String,
		default: ''
	},
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
	// 创建时间
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('User', UserSchema)