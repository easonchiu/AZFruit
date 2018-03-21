module.exports = function(app) {

    const {mongoose} = app

    // 创建一个schema实例
    const AdminUserSchema = new mongoose.Schema({
        // 用户名
        username: { type: String, required: true },
        // 密码
        password: { type: String, required: true }
    })

    return mongoose.model('AdminUser', AdminUserSchema)
}