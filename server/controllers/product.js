var Product = require('../models/product')

class product {
	
	/* 
	 * 创建商品
	 *
	 * !@name 商品名称
	 * !@unit 计量单位，例：只
	 * !@price 商品价格，单位为分
	 * @index 排序
	 * @FCLprice 整箱价格，单位为分
	 * @FCLunit 整箱数量，例：10-12只
	 * @desc 商品描述
	 * @sellCount 售卖量
	 * @FCLsellCount 整箱售卖量
	 * @commentList 留言（刚创建时为空[]）
	 * @online 上架中
	 * @FCLonline 整箱上架中
	 * @stock 库存
	 * @FCLstock 整箱库存
	 *
	 */
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!body.name) {
			return ctx.error({
				msg: '商品名称不能为空'
			})
		}
		else if (!body.unit) {
			return ctx.error({
				msg: '计量单位不能为空'
			})
		}
		else if (!body.price) {
			return ctx.error({
				msg: '商品价格不能为空'
			})
		}

		try {
			const res = await Product.create({
				name: body.name,
				imgs: body.imgs,
				unit: body.unit,
				price: body.price,
				FCLprice: body.FCLprice,
				FCLunit: body.FCLunit,
				desc: body.desc,
				sellCount: body.sellCount,
				FCLsellCount: body.FCLsellCount,
				commentList: body.commentList,
				online: body.online,
				FCLonline: body.FCLonline,
				stock: body.stock,
				FCLstock: body.FCLstock
			})

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
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await Product.count({})
			let list = []

			if (count > 0) {
				list = await Product
					.aggregate([{
						$sort: {
							index: 1,
						}
					}, {
						$project: {
							_id: 0,
							name: 1,
							desc: 1,
							imgs: 1,
							price: 1,
							FCLprice: 1,
							sellCount: 1,
							FCLsellCount: 1,
							online: 1,
							FCLonline: 1,
							stock: 1,
							FCLstock: 1,
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

			const res = await Product
				.findOne({_id: id})

			return ctx.success({
				data: {
					name: res.name,
					imgs: res.imgs,
					unit: res.unit,
					price: res.price,
					FCLprice: res.FCLprice,
					FCLunit: res.FCLunit,
					desc: res.desc,
					sellCount: res.sellCount,
					FCLsellCount: res.FCLsellCount,
					commentList: res.commentList,
					online: res.online,
					FCLonline: res.FCLonline,
					stock: res.stock,
					FCLstock: res.FCLstock,
					createTime: res.createTime,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 修改产品
	static async update(ctx, next) {
		try {
			const { id } = ctx.params

			let find = await Product.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该产品不存在'
				})
			}

			const body = ctx.request.body

			if (!body.name) {
				return ctx.error({
					msg: '商品名称不能为空'
				})
			}
			else if (!body.unit) {
				return ctx.error({
					msg: '计量单位不能为空'
				})
			}
			else if (!body.price) {
				return ctx.error({
					msg: '商品价格不能为空'
				})
			}

			await Product.update({
				_id: id
			}, body)
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 前端获取产品列表
	static async appFetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await Product.count({
				$or: [{
					online: true,
					stock: {
						$gt: 0
					}
				}, {
					FCLonline: true,
					FCLstock: {
						$gt: 0
					}
				}]
			})

			let list = []
			
			if (count > 0) {
				list = await Product
					.aggregate([{
						$match: {
							$or: [{
								online: true,
								stock: {
									$gt: 0
								}
							}, {
								FCLonline: true,
								FCLstock: {
									$gt: 0
								}
							}]
						}
					}, {
						$sort: {
							index: 1
						}
					}, {
						$skip: skip
					}, {
						$limit: limit
					}, {
						$project: {
							_id: 0,
							name: 1,
							unit: 1,
							FCLstock: 1,
							stock: 1,
							FCLonline: 1,
							online: 1,
							FCLsellCount: 1,
							sellCount: 1,
							FCLcount: 1,
							desc: 1,
							FCLprice: 1,
							price: 1,
							id: '$_id'
						}
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

	// 前端获取产品详情
	static async appFetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await Product
				.findOne({_id: id})

			return ctx.success({
				data: {
					name: res.name,
					imgs: res.imgs,
					unit: res.unit,
					price: res.price,
					FCLprice: res.FCLprice,
					FCLunit: res.FCLunit,
					desc: res.desc,
					sellCount: res.sellCount,
					FCLsellCount: res.FCLsellCount,
					online: res.online,
					FCLonline: res.FCLonline,
					stock: res.stock,
					FCLstock: res.FCLstock,
					createTime: res.createTime,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 前端添加评论
	static async appCreateComment(ctx, next) {
		try {
			const { id } = ctx.params

			let find = await Product
				.findOne({_id: id})

			if (!find) {
				return ctx.error({
					msg: '该产品不存在'
				})
			}

			await Product.update({
				_id: id
			}, {
				$push: {
					commentList: {
						comment: '123123',
						userId: '59d5b13b638c724e19602a37',
						name: 'eason',
						header: ':headeruri',
						star: 4.5
					}
				}
			})

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 前端获取评论
	static async appFetchComment(ctx, next) {
		try {
			const { id } = ctx.params

			let res = await Product
				.findOne({_id: id}, {
					'commentList._id': 0,
					'commentList.userId': 0,
				})

			return ctx.success({
				data: res.commentList
			})
		} catch(e) {
			return ctx.error()
		}
	}

}

module.exports = product