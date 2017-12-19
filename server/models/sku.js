var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var SkuSchema = Schema({
	// 所属产品
	pid: { type: String, required: true },
	// 规格描述
	desc: { type: String, default: '' },
	// 库存
	stock: { type: Number, default: 0 },
	// 被锁的库存，即被生成订单后还未支付时，会将库存锁定不让别的用户购买
	lockedStock: { type: Number, default: 0 },
	// 计量单位
	unit: { type: String, required: true },
	// 重量，单位克
	weight: { type: Number, default: '' },
	// 价格
	price: { type: Number, default: 0 },
	// 原价
	prePrice: { type: Number, default: 0 },
	// 上下架
	online: { type: Boolean, default: false },
	// 销量
	sellCount: { type: Number, default: 0 },
	// 创建时间
	createTime: { type: Date, default: Date.now }
})


// 批量占用库存
SkuSchema.statics.occupyStock = function(list) {
	return new Promise(async (resolve, reject) => {
		for (let i = 0; i < list.length; i++) {
			const data = list[i]
			await this.update({
				_id: data.skuId
			}, {
				$inc: {
					stock: -data.amount,
					lockedStock: data.amount,
				}
			})
		}

		resolve()
	})
}

// 批量归还库存
SkuSchema.statics.revertStock = function(list) {
	return new Promise(async (resolve, reject) => {
		for (let i = 0; i < list.length; i++) {
			const data = list[i]
			await this.update({
				_id: data.skuId
			}, {
				$inc: {
					stock: data.amount,
					lockedStock: -data.amount,
				}
			})
		}

		resolve()
	})
}

const model = mongoose.model('Sku', SkuSchema)
module.exports = model