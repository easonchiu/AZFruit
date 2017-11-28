var qiniu = require('qiniu')

// 七牛云key
const conf = {
	ACCESS_KEY: 'cSV16mB_SCxWKFJ0AQiLpvvGijfxir16xZ6xyAEB',
	SECRET_KEY: 'nm_cuny6a5Mpt_iQmUMAjYJcpOpVgm0kJrtgAlGw'
}

qiniu.conf.ACCESS_KEY = conf.ACCESS_KEY
qiniu.conf.SECRET_KEY = conf.SECRET_KEY


module.exports = qiniu