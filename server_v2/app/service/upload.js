const fs = require('fs')
const qiniu = require('../middleware/qiniu')
const mongoose = require('mongoose')

const Service = require('egg').Service;

class upload extends Service {
    
    //构建上传策略函数
    createQnToken(key) {
        var bucket = 'ivcsun'
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key)
        return putPolicy.token()
    }

    //构造上传函数
    uploadFileToQn(uptoken, key, localFile) {
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

    // 存图到本地
    savePicToLocal(filename, base64) {
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
    removeLocalPic(filename) {
        return new Promise((resolve, reject) => {
            fs.unlink(filename, function(err){
                if (err) {
                    reject()
                }
                resolve(filename)
            })
        })
    }

    /**
     * 创建图片
     */
    async create(data) {
        const th = this
        const ctx = th.ctx

        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!data.base64) {
                    return reject('资源不能为空')
                }
                else if (!data.class) {
                    return reject('归类不能为空')
                }

                // 检查图片类型，只允许png,jpg,jpeg
                let fileType = ''
                if ((/:image\/png/).test(data.base64)) {
                    fileType = '.png'
                }
                else if ((/:image\/jpg/).test(data.base64)) {
                    fileType = '.jpg'
                }
                else if ((/:image\/jpeg/).test(data.base64)) {
                    fileType = '.jpeg'
                }
                else {
                    return reject('图片格式不允许')
                }

                // 去掉base64的头部
                const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, '')

                // 将base64存成一个buffer
                const dataBuffer = new Buffer(base64Data, 'base64')

                // 手动生成objectId作为文件名
                const fileName = data.class + '-' + new mongoose.Types.ObjectId()

                // 本地的文件名
                const localFileName = 'upload/' + fileName + fileType

                // 将buffer存到本地目录中
                await th.savePicToLocal(localFileName, dataBuffer)
                
                //上传到七牛后保存的文件名
                const qnFileName = 'dev_' + fileName + fileType

                // 生成上传token
                const qnToken = th.createQnToken(qnFileName)

                // 上传到七牛云
                const qnRes = await th.uploadFileToQn(qnToken, qnFileName, localFileName)

                // 本地的删除
                await th.removeLocalPic(localFileName)
                
                // 数据库保存图片信息
                const doc = {
                    name: fileName,
                    uri: qnRes.key,
                    class: data.class,
                }

                await new ctx.model.Upload(doc).create()
                
                return resolve(doc)
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
    
    /**
     * 获取列表
     */
    async list(skip = 0, limit = 10, classes) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
                // search
                const search = {}
                if (classes) {
                    search.class = classes
                }

                // 计算条目数量
                const count = await ctx.model.Upload.count(search)

                // 查找数据
                let list = []
                if (count > 0) {
                    list = await ctx.model.Upload.aggregate([
                        { $match: search },
                        { $project: { _id: 0, __v: 0 } },
                        { $skip: skip },
                        { $limit: limit }
                    ])
                }

                resolve({
                    list,
                    count,
                    skip,
                    limit
                })
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
    
}

module.exports = upload