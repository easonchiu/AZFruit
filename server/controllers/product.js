var Product = require('../model/product')

class product {
	static async add(ctx, next) {
		
		await Product.create({
			name: 'es6',
			level: 8
		})

	}
}

module.exports = product