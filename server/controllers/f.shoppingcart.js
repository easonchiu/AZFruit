var GoodsModel = require('../models/goods')
var SkuModel = require('../models/sku')
var PostageModel = require('../models/postage')
var UserModel = require('../models/user')

var qs = require('qs')

class Control {
	
	/* 
	 * 添加商品到购物车
	 * 需要注意的是这里仅做添加数据，并没有重新计算总价和总重量之类的
	 */
	static async add(ctx, next) {
		try {
			const body = ctx.request.body
			const {uid} = ctx.state.jwt

			// 检查body字段
			if (!body.pid) {
				return ctx.error({
					msg: '商品id不能为空'
				})
			}
			else if (!body.skuId) {
				return ctx.error({
					msg: '规格id不能为空'
				})
			}
			else if (!body.amount || body.amount < 1) {
				return ctx.error({
					msg: '购买商品数量不正确'
				})
			}

			// 查询产品信息
			const skuDoc = await SkuModel.fetchInfo({
				goodsId: body.pid,
				skuId: body.skuId
			})

			// 如果找不到该产品信息，返回错误
			if (!skuDoc) {
				return ctx.error({
					msg: '没有找到该产品'
				})
			}

			// 如果产品下架了，返回错误
			if (!skuDoc.online) {
				return ctx.error({
					msg: '不好意思，该商品已经下架了哟'
				})
			}

			// 先找用户的购物车中是否有该产品
			let shoppingcartDoc = await UserModel.findOne({
				_id: uid,
			}, 'shoppingcart')

			shoppingcartDoc = !shoppingcartDoc ? [] : shoppingcartDoc.shoppingcart ? shoppingcartDoc.shoppingcart : []
			
			for (let i = 0; i < shoppingcartDoc.length; i++) {
				if (shoppingcartDoc[i].skuId == body.skuId) {
					shoppingcartDoc = shoppingcartDoc[i]
					break
				}
			}

			// 这里只取某个产品，如果没找到，值会是默认的数组，设置为空
			if (Array.isArray(shoppingcartDoc)) {
				shoppingcartDoc = null
			}

			// 开始检查库存及购买限制
			// 有的话取出原来的数量，和这次购买的数量相加
			if (shoppingcartDoc) {
				if (shoppingcartDoc.amount + body.amount > skuDoc.stock) {
					if (body.amount == 1) {
						return ctx.error({
							msg: '库存不够啦'
						})
					} else {
						return ctx.error({
							msg: '库存不够啦，您最多还能购买' + (skuDoc.stock - shoppingcartDoc.amount) + '件~'
						})
					}
				}
				if (shoppingcartDoc.amount + body.amount > 9) {
					return ctx.error({
						msg: '同一件商品最多购买9件哟，您购物车中已经有' + shoppingcartDoc.amount + '件了~'
					})
				}
			}
			// 如果购物车中没有该商品，先检查购买数量，1. 不能超过库存 2. 不能购买超过9件
			else {
				if (body.amount > skuDoc.stock) {
					if (body.amount == 1) {
						return ctx.error({
							msg: '库存不够啦'
						})
					} else {
						return ctx.error({
							msg: '库存不够啦，您最多还能购买' + skuDoc.stock + '件~'
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

			// 如果购物车中有的话，更新数量
			if (shoppingcartDoc) {
				const amount = shoppingcartDoc.amount + body.amount

				await UserModel.update({
					_id: uid,
					'shoppingcart.pid': body.pid,
					'shoppingcart.skuId': body.skuId
				}, {
					$set: {
						'shoppingcart.$.amount': amount
					}
				})
			}
			// 如果购物车中没有，添加
			else {
				// 设置数量为传递的数量
				skuDoc.amount = body.amount

				await UserModel.update({
					_id: uid,
				}, {
					$push: {
						shoppingcart: skuDoc
					}
				})
			}
			
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 刷新并获取购物车中的商品
	static async fetchList(ctx, next) {
		try {
			const {uid} = ctx.state.jwt
			const {distance} = ctx.query
			
			const data = await Control.getShoppingcartInfoWithUser(uid)
			
			// 如果有距离信息，计算运费
			if (distance) {
				const postage = await PostageModel.expense(distance, data.totalPrice, data.totalWeight)
				data.postage = postage
				data.totalPrice += postage
			}

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
			const {uid} = ctx.state.jwt

			if (!body.id) {
				return ctx.error({
					msg: '购物id不能为空'
				})
			}

			await UserModel.update({
				_id: uid,
				'shoppingcart.skuId': body.id
			}, {
				$pull: {
					shoppingcart: {
						skuId: body.id
					}
				}
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
			const {uid} = ctx.state.jwt

			// 检查body参数
			if (!body.id) {
				return ctx.error({
					msg: '购物id不能为空'
				})
			}
			else if (!body.amount) {
				return ctx.error({
					msg: '购买商品数量正确'
				})
			}
			else if (body.amount > 9) {
				return ctx.error({
					msg: '同一件商品最多购买9件哟~'
				})
			}
			
			// 更新数据库
			await UserModel.update({
				_id: uid,
				'shoppingcart.skuId': body.id
			}, {
				$set: {
					'shoppingcart.$.amount': body.amount
				}
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
			
			// 先获取购物车中的所有商品
			let doc = await UserModel.findOne({
				_id: uid
			}, 'shoppingcart')

			doc = !doc ? [] : doc.shoppingcart ? doc.shoppingcart : []

			return ctx.success({
				data: {
					amount: doc.length
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 计算某用户购物车中的信息
	// uid: 用户id
	static async getShoppingcartInfoWithUser(uid) {
		try {
			// 先获取购物车中的所有商品
			let shoppingcartDoc = await UserModel.findOne({
				_id: uid
			}, 'shoppingcart')

			shoppingcartDoc = !shoppingcartDoc ? [] : shoppingcartDoc.shoppingcart ? shoppingcartDoc.shoppingcart : []

			// 如果没有商品，返回空数据
			if (!shoppingcartDoc.length) {
				return {
					list: [],
					postagePrice: 0,
					totalPrice: 0,
					totalWeight: 0,
				}
			}
			
			// 如果有商品的话，继续
			
			// 循环更新购物车内的所有产品
			for (let i = 0; i < shoppingcartDoc.length; i++) {
				const data = shoppingcartDoc[i]

				// 先获取商品的信息
				const skuDoc = await SkuModel.fetchInfo({
					goodsId: data.pid,
					skuId: data.skuId
				})

				// 如果购物车里的商品存在，从商品表中更新商品信息到购物车表
				if (skuDoc) {
					// 分别计算每个规格的总重量和总价
					skuDoc.amount = data.amount
					skuDoc.totalWeight = skuDoc.weight * data.amount
					skuDoc.totalPrice = skuDoc.price * data.amount
					
					// 更新到购物车表
					await UserModel.update({
						_id: uid,
						'shoppingcart.skuId': data.skuId
					}, {
						$set: {
							'shoppingcart.$': skuDoc
						}
					})
				}
				// 如果不存在了，删除
				else {
					await UserModel.update({
						_id: uid,
						'shoppingcart.skuId': data.skuId
					}, {
						$pull: {
							shoppingcart: {
								skuId: data.skuId
							}
						}
					})
				}
			}

			// 再次查找购物车中的所有商品数据，这时商品信息是最新的
			shoppingcartDoc = await UserModel.findOne({
				_id: uid
			}, 'shoppingcart')

			shoppingcartDoc = !shoppingcartDoc ? [] : shoppingcartDoc.shoppingcart ? shoppingcartDoc.shoppingcart : []

			// 计算总价、总重量
			let totalPrice = 0, totalWeight = 0
			for (let i = 0; i < shoppingcartDoc.length; i++) {
				if (shoppingcartDoc[i].online) {
					totalPrice += shoppingcartDoc[i].totalPrice
					totalWeight += shoppingcartDoc[i].totalWeight
				}
			}
			
			// 返回数据
			return {
				list: shoppingcartDoc,
				totalPrice,
				totalWeight
			}
		} catch(e) {
			return false
		}
	}
	
}

module.exports = Control