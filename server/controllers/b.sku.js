var SkuModel = require('../models/sku')
var GoodsModel = require('../models/goods')

class Control {
	
	/* 
	 * 创建商品规格
	 *
	 * !@pid 所属产品
	 * @desc 规格描述
	 * @stock 库存
	 * !@unit 计量单位
	 * @weight 重量，单位克
	 * @price 价格
	 * @prePrice 原价
	 * @online 上下架
	 *
	 */
	static async save(ctx, next) {
		try {
			const { method } = ctx.request
			const { id } = ctx.params

			// 如果请求中有传id，更新，先查有没有这条数据
			if (id && method === 'PATCH') {
				const doc = await SkuModel.findOne({
					_id: id
				})

				if (!doc) {
					return ctx.error({
						msg: '该商品不存在'
					})
				}
			}
			
			// 检查body的参数
			const body = ctx.request.body
			delete body.id

			if (!body.pid) {
				return ctx.error({
					msg: '所属产品不能为空'
				})
			}
			else if (!body.unit) {
				return ctx.error({
					msg: '计量单位不能为空'
				})
			}

			// 有id，更新
			if (id && method === 'PATCH') {
				await SkuModel.update({
					_id: id
				}, body)
			}
			// 没有id，创建
			else {
				await new SkuModel(body).create()
			}
			
			// 更新商品可购买数量的值
			await GoodsModel.insertSkuInfo(body.pid)
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}

	}
	
	// 获取列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10, pid } = ctx.query
			
			if (!pid) {
				return ctx.error({
					msg: '产品id不能为空'
				})
			}

			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await SkuModel.count({})
			let list = []

			if (count > 0) {
				list = await SkuModel
					.aggregate([{
						$match: {
							pid: pid
						}
					},{
						$sort: {
							online: -1,
						}
					}, {
						$project: {
							_id: 0,
							pid: 1,
							desc: 1,
							stock: 1,
							lockedStock: 1,
							unit: 1,
							weight: 1,
							price: 1,
							prePrice: 1,
							sellCount: 1,
							online: 1,
							id: '$_id'
						}
					}, {
						$skip: skip
					}, {
						$limit: limit
					}])
			}

			return ctx.success({
				data: {
					list,
					count,
					skip,
					limit,
				}
			})
		} catch(e) {
			return ctx.error()
		}

	}
	
	// 获取详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await SkuModel.findOne({
				_id: id
			})

			return ctx.success({
				data: {
					pid: res.pid,
					desc: res.desc,
					stock: res.stock,
					lockedStock: res.lockedStock,
					unit: res.unit,
					weight: res.weight,
					price: res.price,
					prePrice: res.prePrice,
					online: res.online,
					createTime: res.createTime,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 删除规格
	static async remove(ctx, next) {
		const body = ctx.request.body

		if (!body.pid) {
			return ctx.error({
				msg: '所属产品不能为空'
			})
		}

		try {
			const { id } = ctx.params
			await SkuModel.remove({
				_id: id
			})
			await GoodsModel.insertSkuInfo(body.pid)
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

}

module.exports = Control