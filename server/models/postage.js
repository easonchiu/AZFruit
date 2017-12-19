var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var PostageSchema = Schema({
	// 超出公里数
	km: { type: Number, required: true },
	// 重量多少以内
	weight: { type: Number, required: true },
	// 运费
	postage: { type: Number, required: true },
	// 递增重量
	eachWeight: { type: Number, default: 500 },
	// 每递增eachWeight增加多少钱
	eachPostage: { type: Number, default: 200 },
	// 满消费免运费
	freePostage: { type: Number, default: 999999 },
	// 使用中
	online: { type: Boolean, default: false },
	// 创建时间
	createTime: { type: Date, default: Date.now }
})

const model = mongoose.model('Postage', PostageSchema)
module.exports = model