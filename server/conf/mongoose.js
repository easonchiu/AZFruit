var mongoose = require('mongoose')
// var dburl = 'mongodb://localhost:27017/azfruit'

// 配置
var config = {
	useMongoClient: true
}

// 连接
mongoose.connect(dburl, config)

// 连接成功 
mongoose.connection.on('connected', function() {
	console.log('mongodb >>> 连接成功')
})

// 连接失败
mongoose.connection.on('error', function(err) {
	console.log('mongodb >>> 连接失败 ' + err)
})

// 断开连接
mongoose.connection.on('disconnected', function() {
	console.log('mongodb >>> 断开连接')
})

module.exports = mongoose