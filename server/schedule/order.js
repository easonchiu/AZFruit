// 订单的定时任务
var schedule = require('node-schedule')
var dateFormat = require('dateformat')


var OrderModel = require('../models/order')
var UserModel = require('../models/user')
var SkuModel = require('../models/sku')


// 清理超时没支付，或被手动关闭的订单
var taskOvertimeOrder = async () => {
	console.log('---------------------')
	console.log(dateFormat(new Date(), 'yyyy-mm-dd, h:MM:ss'), '清理超时没支付，或被手动关闭的订单')
	const res = await OrderModel.find({
		$or: [{
			paymentTimeout: {
				$lt: new Date()
			},
			status: 1
		}, {
			status: 90
		}]
	})

	for (let i = 0; i < res.length; i++) {
		// 解锁商品
		const goods = res[i].list
		if (goods.length) {
			await SkuModel.revertStock(goods)
		}
		
		// 解锁优惠券
		const coupon = res[i].coupon ? res[i].coupon.id : ''
		if (coupon) {
			await UserModel.update({
				_id: res[i].uid,
				'couponList.id': coupon
			}, {
				$set: {
					'couponList.$.locked': false
				}
			})
		}
		
		// 删除订单
		await OrderModel.remove({
			_id: res[i].id
		})
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