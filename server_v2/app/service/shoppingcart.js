const Service = require('egg').Service;

class Shoppingcart extends Service {

	/**
     * 添加商品到购物车
     */
    async append(id, data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }
                else if (!data.skuId || !data.pid) {
                    return reject('找不到相关的商品')
                }
                else if (!data.amount || data.amount !== ~~data.amount) {
                    return reject('请选择购买数量')
                }

                const userData = await ctx.service.user.getById(id)
            
                // 先查看购物车中是否有相同的商品
                const shoppingcart = userData.shoppingcart
                let hasBuy = false
                for (let i = 0; i < shoppingcart.length; i++) {
                    if (shoppingcart[i].skuId === data.skuId) {
                        hasBuy = shoppingcart[i]
                    }
                }
                
                // 限制一次购买的数量
                if (hasBuy && hasBuy.amount >= 9) {
                    return reject('一次最多可购买9件哦~')
                }

                // 查看商品信息
                const sku = await ctx.service.sku.getById(data.skuId)
                if (!sku.online) {
                    return reject('该规格已下架，请购买其他规格商品')
                }
                const goods = await ctx.service.goods.getById(sku.pid)
                if (!goods.online) {
                    return reject('该商品已下架，请购买其他商品')
                }

                // 计算我购买的数量
                let willAmount = data.amount
                if (hasBuy) {
                    willAmount += hasBuy.amount
                }
                // 超过库存，不让购买
                if (willAmount > sku.stock) {
                    return reject('库存不够了哦，您最多可购买' + sku.stock + sku.unit)
                }

                // 更新购物车
                if (hasBuy) {
                    hasBuy.amount = willAmount
                    hasBuy.totalWeight = hasBuy.weight * willAmount
                    hasBuy.totalPrice = hasBuy.price * willAmount
                }
                // 购物车中没有，新增
                else {
                    const newSku = {
                        skuName: sku.desc,
                        amount: willAmount,
                        weight: sku.weight,
                        totalWeight: sku.weight * willAmount,
                        online: true,
                        cover: goods.cover,
                        name: goods.name,
                        unit: sku.unit,
                        price: sku.price,
                        stock: sku.stock,
                        skuId: sku.id,
                        pid: sku.pid,
                        totalPrice: sku.price * willAmount
                    }
                    shoppingcart.push(newSku)
                }

                await ctx.service.user.update(id, {
                    shoppingcart
                })

                return resolve()
            }
            catch(e) {
                if (typeof e === 'string') {
                    return reject(e)
                }
                reject('系统错误')
            }
        })
    }
	
	/**
     * 清空购物车
     */
    async clear(id) {
		const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return reject('id不能为空')
                }

                await ctx.service.user.update(id, {
                	shoppingcart: []
                })

                resolve()
            }
            catch (e) {
            	reject('系统错误')
            }
        })
    }

}

module.exports = Shoppingcart