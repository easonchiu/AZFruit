// 订单的定时任务
var schedule = require('node-schedule')
var dateFormat = require('dateformat')


var OrderModel = require('../models/order')
var SkuModel = require('../models/sku')


// 清理超时没支付，或被手动关闭的订单
var taskOvertimeOrder = async () => {
	console.log('---------------------')
	console.log(dateFormat(new Date(), 'yyyy-mm-dd, h:MM:ss'), '清理超时没支付，或被手动关闭的订单')
	const res = await OrderModel.find({
		$or: [{
			paymentTimeout: {
				$lt: new Date()
			}
		}, {
			status: 90
		}]
	})

	for (let i = 0; i < res.length; i++) {
		const goods = res[i].goodsList
		if (goods.length) {
			await SkuModel.revertStock(goods)
			await OrderModel.remove({
				_id: res[i]._id
			})
		}
	}
	console.log('---------------------')
}


// 定时器(每1分钟)
var task = () => {
	var rule = new schedule.RecurrenceRule()
	rule.second = 30 // 每分钟的第30秒
	schedule.scheduleJob(rule, function(){  
		taskOvertimeOrder()
	})

}

module.exports = task