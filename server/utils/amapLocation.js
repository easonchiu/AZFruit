var key = require('../conf/amapKey')
var axios = require('axios')

// 文字地址转化成经纬度
var getLocation = async address => {

	const locationInfo = await axios.request({
		method: 'get',
		url: 'http://restapi.amap.com/v3/geocode/geo',
		params: {
			address: address,
			city: '上海',
			output: 'json',
			key: key,
		}
	})

	if (!locationInfo.data.geocodes) {
		return undefined
	}

	return locationInfo.data.geocodes[0]
}

module.exports = getLocation