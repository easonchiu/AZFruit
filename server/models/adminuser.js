var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var AdminUserSchema = Schema({
	// 用户名
	username: { type: String, required: true },
	// 密码
	password: { type: String, required: true }
})

module.exports = mongoose.model('AdminUser', AdminUserSchema)