var key = require('../conf/amapKey')
var axios = require('axios')

// 上海市闵行区金汇四季广场的经纬度
var AZShopLat = '121.373930'
var AZShopLon = '31.182040'

// 高得地图测距
var getDistance = async (lat, lon) => {

	const distanceInfo = await axios.request({
		method: 'get',
		url: 'http://restapi.amap.com/v3/distance',
		params: {
			origins: `${lat},${lon}`,
			destination: `${AZShopLat},${AZShopLon}`,
			output: 'json',
			key: key,
			type: 0, // 取直线距离(因为稳定)
		}
	})
	
	if (!distanceInfo.data.results) {
		return undefined
	}

	return distanceInfo.data.results[0]
}

module.exports = getDistance