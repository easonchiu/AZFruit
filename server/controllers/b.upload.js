var UploadModel = require('../models/upload')
var fs = require('fs')
var mongoose = require('../conf/mongoose')
var qiniu = require('../conf/qiniu')

class Control {
	
	//构建上传策略函数
	static createQnToken(key) {
		var bucket = 'ivcsun'
		var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key)
		return putPolicy.token()
	}

	//构造上传函数
	static uploadFileToQn(uptoken, key, localFile) {
		return new Promise((resolve, reject) => {
			var extra = new qiniu.io.PutExtra()
			qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
				if(!err) {
					// 上传成功， 处理返回值
					resolve({
						hash: ret.hash,
						key: ret.key,
						persistentId: ret.persistentId
					})      
				} else {
					// 上传失败， 处理返回代码
					reject(err)
				}
			})
		})
	}
	
	/* 
	 * 创建
	 * !@base64 资源
	 * !@class 归类
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
			let fileType = ''
			if ((/:image\/png/).test(body.base64)) {
				fileType = '.png'
			}
			else if ((/:image\/jpg/).test(body.base64)) {
				fileType = '.jpg'
			}
			else if ((/:image\/jpeg/).test(body.base64)) {
				fileType = '.jpeg'
			}
			else {
				return ctx.error({
					msg: '图片格式不允许'
				})
			}
			
			// 去掉base64的头部
			const base64Data = body.base64.replace(/^data:image\/\w+;base64,/, '')

			// 将base64存成一个buffer
			const dataBuffer = new Buffer(base64Data, 'base64')

			// 手动生成objectId作为文件名
			const fileName = body.class + '-' + new mongoose.Types.ObjectId()

			// 本地的文件名
			const localFileName = 'upload/' + fileName + fileType

			console.log(localFileName)
			
			// 将buffer存到目录中
			await Control.savePicToLocal(localFileName, dataBuffer)

			//上传到七牛后保存的文件名
			const qnFileName = fileName + fileType

			// 生成上传token
			const qnToken = Control.createQnToken(qnFileName)

			// 上传到七牛云
			const qnRes = await Control.uploadFileToQn(qnToken, qnFileName, localFileName)

			// 本地的删除
			await Control.removeLocalPic(localFileName)

			// 数据库保存图片信息
			const doc = {
				name: fileName,
				uri: qnRes.key,
				class: body.class,
			}

			await new UploadModel(doc).create()

			return ctx.success({
				data: doc
			})
		} catch(e) {
			console.log(e)
			return ctx.error()
		}
	}
	
	// 获取分类列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10, classes } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)
			
			// 计算条目数量
			const count = await UploadModel.count({})

			// 查找数据
			let list = []
			if (count > 0) {
				const sql = [
					{ $project: { _id: 0, __v: 0 } },
					{ $skip: skip },
					{ $limit: limit }
				]
				// 如果是要查询某个分类的话
				if (classes != '') {
					sql.unshift({
						$match: { class: classes }
					})
				}
				list = await UploadModel.aggregate(sql)
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

	// 存图到本地
	static savePicToLocal(filename, base64) {
		return new Promise((resolve, reject) => {
			fs.writeFile(filename, base64, function(err){
				if (err) {
					reject()
				}
				resolve(filename)
			})
		})
	}

	// 删除本地图
	static removeLocalPic(filename) {
		return new Promise((resolve, reject) => {
			fs.unlink(filename, function(err){
				if (err) {
					reject()
				}
				resolve(filename)
			})
		})
	}
	
}

module.exports = Control