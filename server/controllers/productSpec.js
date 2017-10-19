var ProductSpec = require('../models/productSpec')
var Product = require('../models/product')

class productSpec {
	
	/* 
	 * 创建商品规格
	 *
	 * @index 排序
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
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!body.pid) {
			return ctx.error({
				msg: '所属产品不能为空'
			})
		}

		if (!body.unit) {
			return ctx.error({
				msg: '计量单位不能为空'
			})
		}
		
		if (!(/^[0-9]*$/g).test(body.index)) {
			return ctx.error({
				msg: '排序编号不能为空且必须为数字'
			})
		}

		try {
			const res = await ProductSpec.create({
				index: body.index,
				pid: body.pid,
				desc: body.desc,
				stock: body.stock,
				unit: body.unit,
				weight: body.weight,
				price: body.price,
				prePrice: body.prePrice,
				online: body.online,
			})

			await productSpec.updateProductSpecCount(body.pid)

			if (res) {
				return ctx.success()
			} else {
				return ctx.error()
			}

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

			const count = await ProductSpec.count({})
			let list = []

			if (count > 0) {
				list = await ProductSpec
					.aggregate([{
						$match: {
							pid: pid
						}
					},{
						$sort: {
							online: -1,
							index: 1,
						}
					}, {
						$project: {
							_id: 0,
							index: 1,
							pid: 1,
							desc: 1,
							stock: 1,
							unit: 1,
							weight: 1,
							price: 1,
							prePrice: 1,
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

			const res = await ProductSpec.findOne({
				_id: id
			})

			return ctx.success({
				data: {
					index: res.index,
					pid: res.pid,
					desc: res.desc,
					stock: res.stock,
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
	
	// 修改规格
	static async update(ctx, next) {
		try {
			const { id } = ctx.params

			let find = await ProductSpec.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该产品不存在'
				})
			}

			const body = ctx.request.body

			if (!body.pid) {
				return ctx.error({
					msg: '所属产品不能为空'
				})
			}

			if (!body.unit) {
				return ctx.error({
					msg: '计量单位不能为空'
				})
			}
			
			if (!(/^[0-9]*$/g).test(body.index)) {
				return ctx.error({
					msg: '排序编号不能为空且必须为数字'
				})
			}

			await ProductSpec.update({
				_id: id
			}, body)

			await productSpec.updateProductSpecCount(body.pid)
			
			return ctx.success()
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
			await ProductSpec.remove({
				_id: id
			})
			await productSpec.updateProductSpecCount(body.pid)
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 修改产品的有库存并上架中的规格数量
	static async updateProductSpecCount(pid) {
		// 获取相关产品，在线，库存大于0的数量
		const count = await ProductSpec.count({
			pid: pid,
			online: true,
			stock: {
				'$gt': 0
			}
		})
		// 更新到产品的数据库中
		await Product.update({
			_id: pid
		}, {
			specCount: count
		}, {
			upsert: true
		})
	}

}

module.exports = productSpec