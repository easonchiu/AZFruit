var Koa = require('koa')
var onerror = require('koa-onerror')
var logger = require('koa-logger')
var bodyParser = require('koa-bodyparser')
var helmet = require('koa-helmet')
var http = require('http')

// 声明端口号
var port = 8080

// 导入路由
var userRoute = require('./routes/user')

// 创建实例
var app = new Koa()

// 错误捕获
onerror(app)

// 加载中间件
app
	.use(logger())
	.use(bodyParser())
	.use(helmet())

// 加载路由
app
	.use(userRoute.routes(), userRoute.allowedMethods())

// 起一个服务
const server = http.createServer(app.callback())
server.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`))
