var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var GoodsSchema = Schema({
	id: { type: String },
	// 产品名称
	name: { type: String, required: true },
	// 排序
	index: { type: Number, required: true },
	// 产品描述
	desc: { type: String, default: '' },
	// 封面图
	cover: { type: String, default: '' },
	// 参数
	parameter: [Schema({
		name: { type: String, default: '' },
		value: { type: String, default: '' }
	}, { _id: false })],
	// 是否进口
	isImport: { type: Boolean, default: false },
	// 产地
	origin: { type: String, default: '' },
	// 所属分类
	category: [Schema({
		name: { type: String, default: '' },
		id: { type: String, default: '' }
	}, { _id: false })],
	// 标签
	badge: { type: String, default: '' },
	// 标签底色
	badgeColor: { type: String, default: '' },
	// 产品轮播图
	imgs: [{ type: String, default: '' }],
	// 详情
	detail: { type: String, default: '' },
	// 首页推荐排序
	recom: { type: Number, default: 0 },
	// 排名
	ranking: { type: Number, default: 0 },
	// 上下架
	online: { type: Boolean, default: false },
	// 上架中的规格数量
	skuCount: { type: Number, default: 0 },
	// 规格中价格最低的存入
	price: { type: Number, default: 0 },
	// 规格中价格最低的存入
	prePrice: { type: Number, default: 0 },
	// 规格中价格最低的存入
	unit: { type: String, default: '' },
	// 销量，这里的销量即所有规格的总和
	sellCount: { type: Number, default: 0 },
	// 创建时间
	createTime: { type: Date, default: Date.now }
})


// 创建
GoodsSchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

// 更新sku数量与sku最低价等信息，参数：pid -> 商品id
GoodsSchema.statics.insertSkuInfo = function(pid) {
	return new Promise(async (resolve, reject) => {
		// 获取相关sku，在线，库存大于0的
		const res = await mongoose.model('Sku')
			.aggregate([{
				$match: {
					pid: pid,
					online: true,
					stock: { $gt: 0 }
				}
			}, {
				$sort: {
					price: 1,
				}
			}, {
				$project: {
					_id: 0,
					unit: 1,
					price: 1,
					prePrice: 1,
				}
			}])
		
		// 初始化
		const obj = {
			skuCount: 0,
			price: 0,
			prePrice: 0,
			unit: ''
		}
		
		// 如果有数据，在商品表中存入库存数量与最低的sku价格
		if (res[0]) {
			obj.skuCount = res.length
			obj.price = res[0].price || 0
			obj.prePrice = res[0].prePrice || 0
			obj.unit = res[0].unit || ''
		}

		// 更新到产品的数据库中
		await this.update({
			_id: pid
		}, obj, {
			upsert: true
		})

		resolve()
	})
}

const model = mongoose.model('Goods', GoodsSchema)
module.exports = model