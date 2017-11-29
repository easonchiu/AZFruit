const ua = navigator.userAgent.toLowerCase()
const isWX = ua.indexOf('micromessenger') != -1

const APPID = 'wxafcd379c5276d6a3'
const REDIRECT_URI = encodeURIComponent(window.location.href)

import http from 'src/assets/libs/http'

export const isWeixin = isWX

export const getOpenid = e => localStorage.getItem('openid')

const setOpenid = e => localStorage.setItem('openid', e)

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