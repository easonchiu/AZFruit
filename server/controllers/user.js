var User = require('../model/user')

class user {
	static async add(ctx, next) {

		const {name, group = 1} = ctx.query

		const find = await User.findOne({
			name: name
		})

		if (name === '') {
			return ctx.body = '无名'
		}

		if (find) {
			return ctx.body = '已存在'
		}

		const count = await User.count()
		let skill = '599a47dbedc7a70ca9540bef'
		let like = ['a', 'b', 'c']

		if (count % 2 == 0) {
			skill = '599a47ddedc7a70ca9540bf0'
			like = ['c', 'd', 'e']
		}

		const res = await User.create({
			name: name,
			group: group,
			skill: skill,
			uid: count,
			like: like
		})
		
		return ctx.body = res
	}

	static async get(ctx, next) {
		
		const res = await User
			.aggregate([
				{
					$lookup: {
						from: 'skills',
						localField: 'skill',
						foreignField: '_id',
						as: 'skill'
					}
				}, {
					$project: {
						_id: false,
						name: true,
						uid: true,
						like: true,
						createTime: true,
						skill: true,
						level: '$skill.level'
					}
				}
			])

		return ctx.body = res
	}

	static async test(ctx, next) {
		const res = await User
			.findOne()

		return ctx.body = res
	}

	static async remove(ctx, next) {

		const res = await User
			.remove({})

		if (res.result.ok == 1) {
			return ctx.body = 'success, 共删除' + res.result.n + '条'
		}

		return ctx.body = res
	}


}

module.exports = user