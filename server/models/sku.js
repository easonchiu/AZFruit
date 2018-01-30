var mongoose = require('../conf/mongoose')
var GoodsModel = require('./goods')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var SkuSchema = Schema({
	id: { type: String },
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

// 创建
SkuSchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

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

			const res = await this.findOne({
				_id: data.skuId
			})

			// 计算被锁库存的数量，归还时不能还到负值
			const locked = Math.min(res.lockedStock, data.amount)

			await this.update({
				_id: data.skuId
			}, {
				$inc: {
					stock: data.amount,
					lockedStock: -locked,
				}
			})
		}

		resolve()
	})
}

// 批量将库存改为已售卖
SkuSchema.statics.sellStock = function(list) {
	return new Promise(async (resolve, reject) => {
		for (let i = 0; i < list.length; i++) {
			const data = list[i]
			await this.update({
				_id: data.skuId
			}, {
				$inc: {
					lockedStock: -data.amount,
					sellCount: data.amount
				}
			})
		}

		resolve()
	})
}

// 获取信息
SkuSchema.statics.fetchInfo = function({goodsId, skuId}) {
	return new Promise(async (resolve, reject) => {
		const skuDoc = await this.findOne({
			_id: skuId
		})

		// 如果没找到产品信息或没找到规格信息，提示用户没相关产品
		if (!skuDoc) {
			resolve(null)
			return
		}

		const goodsDoc = await GoodsModel.findOne({
			_id: goodsId
		})

		// 如果没找到产品信息或没找到规格信息，提示用户没相关产品
	 	if (!goodsDoc) {
			resolve(null)
			return
		}

		// 如果找到，整合信息并返回
		resolve({
			cover: goodsDoc.cover,
			name: goodsDoc.name,
			skuName: skuDoc.desc,
			unit: skuDoc.unit,
			price: skuDoc.price,
			weight: skuDoc.weight,
			online: goodsDoc.online && skuDoc.online && skuDoc.stock > 0,
			stock: skuDoc.stock,
			skuId: skuId,
			pid: goodsId
		})
		
	})
}

const model = mongoose.model('Sku', SkuSchema)
module.exports = model