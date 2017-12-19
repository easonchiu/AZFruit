var ShoppingcartModel = require('../models/shoppingcart')
var GoodsModel = require('../models/goods')
var SkuModel = require('../models/sku')
var PostageModel = require('../models/postage')


var AddressCon = require('./address')

var qs = require('qs')

class Control {
	
	/* 
	 * 添加商品到购物车
	 * 需要注意的是这里仅做添加数据，并没有重新计算总价和总重量之类的
	 */
	static async add(ctx, next) {
		try {
			const body = ctx.request.body

			if (!body.pid) {
				return ctx.error({
					msg: '商品id不能为空'
				})
			}
			
			if (!body.skuId) {
				return ctx.error({
					msg: '规格id不能为空'
				})
			}

			if (!body.amount || body.amount < 1) {
				return ctx.error({
					msg: '购买商品数量不正确'
				})
			}

			// 查询信息
			const info = await Control.getGoodsInfo(body)
			if (!info) {
				return ctx.error({
					msg: '没有找到该产品'
				})
			}

			// 如果产品上架中，说明可以买
			// 累加购买数量（如果购物车中没有该产品的话，累加会从0开始加，有的话则在原数量基础上再增加）
			if (info.online) {
				info.$inc = {
					amount: body.amount
				}
			} else {
				return ctx.error({
					msg: '不好意思，该商品已经下架了哟'
				})
			}

			// 先找购物车中是否有该产品
			const {uid} = ctx.state.jwt

			const find = await ShoppingcartModel.findOne({
				uid: uid,
				pid: body.pid,
				skuId: body.skuId
			}, 'amount')

			// 有的话取出原来的数量，和这次购买的数量相加
			if (find) {
				if (find.amount + body.amount > info.stock) {
					if (body.amount == 1) {
						return ctx.error({
							msg: '库存不够啦'
						})
					} else {
						return ctx.error({
							msg: '库存不够啦，您最多还能购买' + (info.stock - find.amount) + '件~'
						})
					}
				}
				if (find.amount + body.amount > 9) {
					return ctx.error({
						msg: '同一件商品最多购买9件哟，您购物车中已经有' + find.amount + '件了~'
					})
				}
			} else {
				if (body.amount > info.stock) {
					if (body.amount == 1) {
						return ctx.error({
							msg: '库存不够啦'
						})
					} else {
						return ctx.error({
							msg: '库存不够啦，您最多还能购买' + info.stock + '件~'
						})
					}
				}
				if (body.amount > 9) {
					return ctx.error({
						msg: '同一件商品最多购买9件哟~'
					})
				}
			}

			// 添加新的产品到购物车数据
			// 购物车中没有的话会添加
			// 有的话叠加数量
			await ShoppingcartModel.
				update({
					uid: uid,
					pid: body.pid,
					skuId: body.skuId,
				}, info, {
					upsert: true
				})

			// 添加商品的时候顺便做一个操作，删除所有在购物车中超过7天未更新的产品
			await Control.deleteGoodsInShoppingcartOverDays(7)
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 刷新并获取购物车中的商品
	static async fetchList(ctx, next) {
		try {
			const {uid} = ctx.state.jwt
			
			// 找到请求中的addressId
			const search = qs.parse(ctx.search.replace(/^\?/, ''))

			const data = await Control.getShoppingcartInfo(uid, search.addressId)

			if (data) {
				return ctx.success({
					data: data
				})
			} else {
				return ctx.error()
			}
		} catch(e) {
			return ctx.error()
		}
	}

	// 从购物车中移除商品
	static async remove(ctx, next) {
		try {
			const body = ctx.request.body

			if (!body.id) {
				return ctx.error({
					msg: '购物id不能为空'
				})
			}
		
			const {uid} = ctx.state.jwt

			await ShoppingcartModel.remove({
				_id: body.id,
				uid: uid
			})

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 更新某个商品的购买数量
	static async update(ctx, next) {
		try {
			const body = ctx.request.body

			if (!body.id) {
				return ctx.error({
					msg: '购物id不能为空'
				})
			}

			if (!body.amount) {
				return ctx.error({
					msg: '购买商品数量正确'
				})
			}
		
			const {uid} = ctx.state.jwt

			await ShoppingcartModel.update({
				_id: body.id,
				uid: uid
			}, {
				amount: body.amount
			})

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 获取购物车商品的数量
	static async fetchAmount(ctx, next) {

		try {
			const {uid} = ctx.state.jwt
			
			// 先获取购物车中的所以商品
			const find = await ShoppingcartModel.find({
				uid
			}, {
				pid: 1,
				skuId: 1,
				amount: 1,
				_id: 1
			})
			
			let amount = 0
			for (let i = 0; i < find.length; i++) {
				// 先获取商品的信息
				const info = await Control.getGoodsInfo({
					pid: find[i].pid,
					skuId: find[i].skuId
				})
				
				// 如果商品存在
				if (info) {
					amount ++
				}
			}

			return ctx.success({
				data: {
					amount
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取单个产品的信息
	static async getGoodsInfo({pid = '', skuId = ''}) {
		const skuInfo = await SkuModel
			.findOne({
				_id: skuId
			})

		const goodsInfo = await GoodsModel
			.findOne({
				_id: pid
			})

		// 如果没找到产品信息或没找到规格信息，提示用户没相关产品
		if (!skuInfo || !goodsInfo) {
			return false
		}
		
		// 如果找到，整合信息并返回
		return {
			cover: goodsInfo.cover,
			name: goodsInfo.name,
			skuName: skuInfo.desc,
			unit: skuInfo.unit,
			price: skuInfo.price,
			weight: skuInfo.weight,
			online: goodsInfo.online && skuInfo.online && skuInfo.stock > 0,
			stock: skuInfo.stock,
			skuId: skuId,
			pid: pid
		}
	}
	
	// 这里针对全部用户的数据
	// 如果商品在购物车中停留超过{day}天，删除购物车商品，保持数据库干净
	static async deleteGoodsInShoppingcartOverDays(day) {
		const now = new Date().getTime()
		const overDays = now - 60 * 60 * 1000 * 24 * day

		const res = await ShoppingcartModel.remove({
		    updateTime: {
		        '$lte': new Date(overDays)
		    }
		})
		return res
	}

	// 计算某用户购物车中的信息
	// uid: 用户id
	// aid: 地址id,若没有的话使用默认地址,如果默认地址也没有的话将不返回地址信息
	static async getShoppingcartInfo(uid, aid) {
		try {
			
			// 获取地址
			const resAddress = await AddressCon.getAddressById(uid, aid, true)

			// 先获取购物车中的所以商品
			const find = await ShoppingcartModel.find({
				uid: uid
			}, {
				pid: 1,
				skuId: 1,
				amount: 1,
				_id: 1
			})

			// 如果没有商品，返回空数据
			if (!find) {
				return {
					address: resAddress,
					list: [],
					postagePrice: 0,
					totalPrice: 0,
					totalWeight: 0,
				}
			}
			
			// 如果有商品的话，继续
			
			// 循环更新购物车内的所有产品
			for (let i = 0; i < find.length; i++) {
				const data = find[i]

				// 先获取商品的信息
				const info = await Control.getGoodsInfo({
					pid: data.pid,
					skuId: data.skuId
				})

				// 如果购物车里的商品存在，更新
				if (info) {
					// 分别计算每个规格的总重量和总价
					info.totalWeight = info.weight * data.amount
					info.totalPrice = info.price * data.amount

					await ShoppingcartModel.update({
						_id: data._id
					}, info)
				}
				// 如果不存在了，删除
				else {
					await ShoppingcartModel.remove({
						_id: data._id
					})
				}
			}

			// 再次查找所有数据
			const list = await ShoppingcartModel
				.aggregate({
					$match: {
						uid: uid
					}
				}, {
					$project: {
						id: '$_id',
						_id: 0,
						cover: 1,
						name: 1,
						skuName: 1,
						unit: 1,
						amount: 1,
						price: 1,
						totalPrice: 1,
						weight: 1,
						totalWeight: 1,
						online: 1,
						stock: 1,
						skuId: 1,
						pid: 1,
					}
				})

			// 计算总价、总重量
			let totalPrice = 0, totalWeight = 0
			for (let i = 0; i < list.length; i++) {
				if (list[i].online) {
					totalPrice += list[i].totalPrice
					totalWeight += list[i].totalWeight
				}
			}

			// 如果有地址，获取数据库中的运费列表
			let postagePrice = 0
			if (resAddress) {
				postagePrice = await PostageModel.count(resAddress.distance, totalPrice, totalWeight)
			}

			return {
				list,
				postagePrice,
				totalPrice,
				totalWeight,
				address: resAddress
			}
		} catch(e) {
			return false
		}
	}

	// 清空购物车
	static removeAll(uid) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!uid) {
					reject()
				}
				await ShoppingcartModel.remove({
					uid
				})
				resolve()
			}
			catch(e) {
				reject()
			}
		})
	}
	
}

module.exports = Control