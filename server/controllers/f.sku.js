var SkuModel = require('../models/sku')
var GoodsModel = require('../models/goods')

class Control {

	// 用户获取列表
	static async fetchList(ctx, next) {
		try {
			let { id } = ctx.params
			
			if (!id) {
				return ctx.error({
					msg: '产品id不能为空'
				})
			}

			const list = await SkuModel
				.aggregate([{
					$match: {
						pid: id,
						online: true,
						stock: {
							$gt: 0
						}
					}
				},{
					$sort: {
						price: 1,
					}
				}, {
					$project: {
						_id: 0,
						desc: 1,
						unit: 1,
						weight: 1,
						price: 1,
						prePrice: 1,
						id: '$_id'
					}
				}])

			return ctx.success({
				data: list
			})
		} catch(e) {
			return ctx.error()
		}
	}
	

}

module.exports = Control