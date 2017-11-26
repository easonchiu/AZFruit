const ua = navigator.userAgent.toLowerCase()
const isWX = ua.indexOf('micromessenger') != -1

const APPID = 'wxafcd379c5276d6a3'
const REDIRECT_URI = encodeURIComponent('http://47.92.130.15/callback/')

import http from 'src/assets/libs/http'

export const isWeixin = isWX || true

export const getOpenid = e => sessionStorage.getItem('openid')

const setOpenid = e => sessionStorage.setItem('openid', e)

export const authorize = async e => {
	const href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=#wechat_redirect`
	window.location.href = href
}

export const getTokenWithCode = async code => {
	const res = await http.request({
		method: 'post',
		url: `/wx/auth`,
		data: {
			code
		}
	})
	setOpenid(res.openid)
}