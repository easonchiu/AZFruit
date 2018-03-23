module.exports = function(app) {
	
	const {mongoose} = app

	// 创建一个schema实例
	const GoodsSchema = new mongoose.Schema({
		id: { type: String },
		// 产品名称
		name: { type: String, required: true },
		// 排序
		index: { type: Number, default: 0 },
		// 产品描述
		desc: { type: String, default: '' },
		// 封面图
		cover: { type: String, default: '' },
		// 参数
		parameter: [mongoose.Schema({
			name: { type: String, default: '' },
			value: { type: String, default: '' }
		}, { _id: false })],
		// 是否进口
		isImport: { type: Boolean, default: false },
		// 产地
		origin: { type: String, default: '' },
		// 所属分类
		category: [mongoose.Schema({
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
		// 规格中价格最低的价格
		price: { type: Number, default: 0 },
		// 规格中价格最低的原价
		prePrice: { type: Number, default: 0 },
		// 规格中价格最低的单位
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

	return mongoose.model('Goods', GoodsSchema)
}