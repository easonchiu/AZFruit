class Reg {
	static isMobile(mobile) {
		var reg = /^1[0-9]{10}$/
		return reg.test(mobile)
	}
}

module.exports = Reg