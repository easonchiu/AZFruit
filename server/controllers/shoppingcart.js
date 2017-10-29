var Shoppingcart = require('../models/shoppingcart')
var Product = require('../models/product')
var ProductSpec = require('../models/productSpec')

class shoppingcart {
	
	/* 
	 * 添加商品到购物车
	 * 需要注意的是这里仅做添加数据，并没有重新计算总价和总重量之类的
	 */
	static async add(ctx, next) {
		const body = ctx.request.body

		if (!body.pid) {
			return ctx.error({
				msg: '商品id不能为空'
			})
		}
		
		if (!body.specId) {
			return ctx.error({
				msg: '规格id不能为空'
			})
		}

		if (!body.count) {
			return ctx.error({
				msg: '购买商品数量正确'
			})
		}
		
		try {
			// 查询信息
			const info = await shoppingcart.getProductInfo(body)
			if (!info) {
				return ctx.error({
					msg: '没有找到该产品'
				})
			}

			// 如果产品上架中，累加购买数量
			if (info.online) {
				info.$inc = {
					count: body.count
				}
			}

			// 先找购物车中是否有该产品
			const find = await Shoppingcart.findOne({
				uid: body.uid,
				pid: body.pid,
				specId: body.specId
			}, 'count')

			// 有的话取出原来的数量，和这次购买的数量相加
			if (find) {
				if (find.count + body.count < 1) {
					return ctx.error({
						msg: '购买数量不正确'
					})
				}
				else if (find.count + body.count > info.stock) {
					if (body.count == 1) {
						return ctx.error({
							msg: '库存不够啦'
						})
					} else {
						return ctx.error({
							msg: '库存不够啦，您最多还能购买' + (info.stock - find.count) + '件~'
						})
					}
				}
				if (find.count + body.count > 9) {
					return ctx.error({
						msg: '同一件商品最多购买9件哟，您购物车中已经有' + find.count + '件了~'
					})
				}
			} else {
				if (body.count < 1) {
					return ctx.error({
						msg: '购买数量不正确'
					})
				}
				else if (body.count > info.stock) {
					if (body.count == 1) {
						return ctx.error({
							msg: '库存不够啦'
						})
					} else {
						return ctx.error({
							msg: '库存不够啦，您最多还能购买' + info.stock + '件~'
						})
					}
				}
				if (body.count > 9) {
					return ctx.error({
						msg: '同一件商品最多购买9件哟~'
					})
				}
			}

			// 添加新的产品到购物车数据
			// 如果产品上架中，购物车中没有的话会添加
			// 如果已经下架，只会做更新已在购物车中的商品，不会添加
			await Shoppingcart.
				update({
					uid: body.uid,
					pid: body.pid,
					specId: body.specId
				}, info, {
					upsert: info.online
				})
			
			// 如果产品下架了，也是需要更新购物车的，这时不更新购买数量，只更新产品信息
			// 然后提示用户已下架
			if (!info.online) {
				return ctx.error({
					msg: '不好意思，该商品已经下架了哟'
				})
			}

			// 计算我的购物车产品规格数量
			const count = await Shoppingcart.count({
				uid: body.uid
			})
			
			return ctx.success({
				data: {
					count: count
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 刷新并获取购物车中的商品
	static async fetch(ctx, next) {
		try {

			// 先获取购物车中的所以商品
			const find = await Shoppingcart.find({
				uid: 'test'
			}, {
				pid: 1,
				specId: 1,
				count: 1,
				_id: 1
			})

			if (!find) {
				return ctx.success({
					data: []
				})
			}

			// 循环更新购物车内的所有产品
			for (let i = 0; i < find.length; i++) {
				const data = find[i]

				// 先获取商品的信息
				const info = await shoppingcart.getProductInfo({
					pid: data.pid,
					specId: data.specId
				})

				// 如果购物车里的商品存在，更新
				if (info) {
					await Shoppingcart.update({
						_id: data._id
					}, {
						name: info.name,
						specName: info.specName,
						pid: info.pid,
						specId: info.specId,
						cover: info.cover,
						weight: info.weight * data.count,
						online: info.online,
						price: info.price,
						totalPrice: info.price * data.count,
						unit: info.unit,
						stock: info.stock
					})
				}
				// 如果不存在了，删除
				else {
					await Shoppingcart.remove({
						_id: data._id
					})
				}
			}

			// 再次查找所有数据
			const refind = await Shoppingcart
				.aggregate([{
					$match: {
						uid: 'test'
					}
				}, {
					$project: {
						_id: 0,
						id: '$_id',
						name: 1,
						specName: 1,
						pid: 1,
						specId: 1,
						count: 1,
						cover: 1,
						weight: 1,
						online: 1,
						price: 1,
						totalPrice: 1,
						unit: 1,
						stock: 1
					}
				}])

			// 计算总价
			let totalPrice = 0
			for (let i = 0; i < refind.length; i++) {
				if (refind[i].online) {
					totalPrice += refind[i].totalPrice
				}
			}

			return ctx.success({
				data: {
					list: refind,
					totalPrice,
				}
			})

		} catch(e) {
			return ctx.error()
		}
	}

	// 从购物车中移除商品
	static async remove(ctx, next) {
		const body = ctx.request.body

		if (!body.id) {
			return ctx.error({
				msg: '购物id不能为空'
			})
		}

		try {
			await Shoppingcart.remove({
				_id: body.id
			})

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 更新某个商品的购买数量
	static async update(ctx, next) {
		const body = ctx.request.body

		if (!body.id) {
			return ctx.error({
				msg: '购物id不能为空'
			})
		}

		if (!body.count) {
			return ctx.error({
				msg: '购买商品数量正确'
			})
		}

		try {
			await Shoppingcart.update({
				_id: body.id
			}, {
				count: body.count
			})

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取单个产品的信息
	static async getProductInfo({pid = '', specId = ''}) {
		const specInfo = await ProductSpec
			.findOne({
				pid: pid,
				_id: specId
			})

		const productInfo = await Product
			.findOne({
				_id: pid
			})
		
		// 如果没找到产品信息或没找到规格信息，提示用户没相关产品
		if (!specInfo || !productInfo) {
			return false
		}
		
		// 如果找到，整合信息并返回
		const res = {
			cover: productInfo.cover,
			name: productInfo.name,
			specName: specInfo.desc,
			unit: specInfo.unit,
			price: specInfo.price,
			weight: specInfo.weight,
			online: productInfo.online && specInfo.online && specInfo.stock > 0,
			stock: specInfo.stock,
			specId: specId,
			pid: pid
		}
		return res
	}
	
	
	
}

module.exports = shoppingcart