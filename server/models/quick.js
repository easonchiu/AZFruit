var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var QuickSchema = Schema({
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

// 查找上线中的列表
QuickSchema.statics.findOnlineList = async function() {
	const res = await this.aggregate([{
		$match: {
			online: true
		}
	}, {
		$sort: {
			index: 1
		}
	}, {
		$project: {
			_id: 0,
			__v: 0,
			online: 0,
			index: 0
		}
	}])
	return res
}

const model = mongoose.model('Quick', QuickSchema)
module.exports = model