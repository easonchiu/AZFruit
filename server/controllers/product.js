var Product = require('../model/product')

class product {
	static async add(ctx, next) {
		
		await Product.create({
			
		})

	}
}

module.exports = product