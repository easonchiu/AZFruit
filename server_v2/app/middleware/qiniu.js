var conf = require('../conf/qiniu')
var qiniu = require('qiniu')


qiniu.conf.ACCESS_KEY = conf.ACCESS_KEY
qiniu.conf.SECRET_KEY = conf.SECRET_KEY


module.exports = qiniu