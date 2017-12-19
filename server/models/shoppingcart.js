var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var ShoppingcartSchema = Schema({
	// 用户id
	uid: { type: String, required: true },
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
	// 创建时间
	createTime: { type: Date, default: Date.now },
	// 更新时间
	updateTime: { type: Date, default: Date.now }
}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
})

const model = mongoose.model('Shoppingcart', ShoppingcartSchema)
module.exports = model