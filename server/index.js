var Koa = require('koa')
var onerror = require('koa-onerror')
var logger = require('koa-logger')
var bodyParser = require('koa-bodyparser')
var helmet = require('koa-helmet')
var http = require('http')
var response = require('./middlewares/response')

// 声明端口号
var port = 8080

// 导入路由
var userRoute = require('./routes/user')
var bannerRoute = require('./routes/banner')
var orderRoute = require('./routes/order')
var productRoute = require('./routes/product')
var categoryRoute = require('./routes/category')
var quickRoute = require('./routes/quick')
var postageRoute = require('./routes/postage')
var uploadRoute = require('./routes/upload')
var adminUserRoute = require('./routes/adminuser')

var jwt = require('./middlewares/jwt')

// 创建实例
var app = new Koa()

// 错误捕获
onerror(app)

// 加载中间件
app
	.use(logger())
	.use(bodyParser())
	.use(helmet())
	.use(response())
	// 除登录接口，其他接口都要jwt验证
	// .use((ctx, next) => {
	// 	if (ctx.request.url.indexOf('/adminuser') >= 0) {
	// 		return next()
	// 	}
	// 	return jwt(ctx, next)
	// })

// 加载路由
app
	.use(userRoute.routes(), userRoute.allowedMethods())
	.use(bannerRoute.routes(), bannerRoute.allowedMethods())
	.use(orderRoute.routes(), orderRoute.allowedMethods())
	.use(productRoute.routes(), productRoute.allowedMethods())
	.use(categoryRoute.routes(), categoryRoute.allowedMethods())
	.use(quickRoute.routes(), quickRoute.allowedMethods())
	.use(postageRoute.routes(), postageRoute.allowedMethods())
	.use(uploadRoute.routes(), uploadRoute.allowedMethods())
	.use(adminUserRoute.routes(), adminUserRoute.allowedMethods())

// 起一个服务
const server = http.createServer(app.callback())
server.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`))
