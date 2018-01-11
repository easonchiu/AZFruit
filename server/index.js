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
var adminUserRoute = require('./routes/adminuser')

var userRoute = require('./routes/user')
var bannerRoute = require('./routes/banner')
var orderRoute = require('./routes/order')
var goodsRoute = require('./routes/goods')
var couponRoute = require('./routes/coupon')
var categoryRoute = require('./routes/category')
var quickRoute = require('./routes/quick')
var postageRoute = require('./routes/postage')
var uploadRoute = require('./routes/upload')
var shoppingcartRoute = require('./routes/shoppingcart')
var addressRoute = require('./routes/address')
var wxRoute = require('./routes/wx')

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

// 加载路由
app
	.use(adminUserRoute.routes(), adminUserRoute.allowedMethods())
	.use(userRoute.routes(), userRoute.allowedMethods())
	.use(bannerRoute.routes(), bannerRoute.allowedMethods())
	.use(orderRoute.routes(), orderRoute.allowedMethods())
	.use(goodsRoute.routes(), goodsRoute.allowedMethods())
	.use(couponRoute.routes(), couponRoute.allowedMethods())
	.use(categoryRoute.routes(), categoryRoute.allowedMethods())
	.use(quickRoute.routes(), quickRoute.allowedMethods())
	.use(postageRoute.routes(), postageRoute.allowedMethods())
	.use(uploadRoute.routes(), uploadRoute.allowedMethods())
	.use(shoppingcartRoute.routes(), shoppingcartRoute.allowedMethods())
	.use(addressRoute.routes(), addressRoute.allowedMethods())
	.use(wxRoute.routes(), wxRoute.allowedMethods())

// 引入计划任务
var taskOrder = require('./schedule/order')

// 起一个服务
const server = http.createServer(app.callback())
server.listen(port, '0.0.0.0', () => {
	console.log(`✅  The server is running at http://localhost:${port}/`)
	taskOrder()
})






