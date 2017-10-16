var Upload = require('../models/upload')
var fs = require('fs')
var mongoose = require('../conf/mongoose')


class upload {
	
	/* 
	 * 创建
	 *
	 * !@base64 资源
	 * !@class 归类
	 *
	 */
	static async save(ctx, next) {
		const body = ctx.request.body

		if (!body.base64) {
			return ctx.error({
				msg: '资源不能为空'
			})
		}

		if (!body.class) {
			return ctx.error({
				msg: '归类不能为空'
			})
		}

		try {
			// 手动生成objectId作为文件名
			const filename = new mongoose.Types.ObjectId()
			
			let type = ''
			if ((/:image\/png/).test(body.base64)) {
				type = '.png'
			} else if ((/:image\/jpg/).test(body.base64)) {
				type = '.jpg'
			} else if ((/:image\/jpeg/).test(body.base64)) {
				type = '.jpeg'
			} else {
				return ctx.error({
					msg: '图片格式不允许'
				})
			}
			
			// 去掉base64的头部
			const base64Data = body.base64.replace(/^data:image\/\w+;base64,/, '')
			// 将base64存成一个buffer
			const dataBuffer = new Buffer(base64Data, 'base64')
			// 将buffer存到目录中
			await upload.write('upload/'+body.class+'-'+filename+type, dataBuffer)
			// 数据库保存图片信息
			await Upload.create({
				name: body.class+'-'+filename,
				uri: body.class+'-'+filename+type,
				class: body.class,
			})
			return ctx.success({
				data: body.class+'-'+filename+type
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取分类列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10, classes } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await Upload.count({})
			let list = []

			if (count > 0) {
				const sql = [{
					$project: {
						_id: 0,
						name: 1,
						uri: 1,
						class: 1,
						createTime: 1,
					}
				}, {
					$skip: skip
				}, {
					$limit: limit
				}]
				if (classes != '') {
					sql.unshift({
						$match: {
							class: classes
						}
					})
				}
				list = await Upload
					.aggregate(sql)
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

	// 存图
	static write(file, base64) {
		return new Promise((resolve, reject) => {
			fs.writeFile(file, base64, function(err){
				if (err) {
					reject()
				}
				resolve(file)
			})
		})
	}
	
}

module.exports = upload