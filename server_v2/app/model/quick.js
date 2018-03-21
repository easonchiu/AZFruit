module.exports = function(app) {

    const {mongoose} = app

    // 创建一个schema实例
    const QuickSchema = new mongoose.Schema({
        id: { type: String },
        // 名称
        name: { type: String, required: true },
        // 图标地址
        uri: { type: String, required: true },
        // 链接
        link: { type: String, required: true },
        // 是否使用中
        online: { type: Boolean, defaut: true },
        // 排序
        index: { type: Number, required: true },
        // 创建时间
        createTime: { type: Date, default: Date.now }
    })

    // 创建
    QuickSchema.methods.create = function() {
        this.id = this._id
        return this.save()
    }

    return mongoose.model('Quick', QuickSchema)
}