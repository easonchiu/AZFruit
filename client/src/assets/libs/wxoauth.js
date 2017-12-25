const ua = navigator.userAgent.toLowerCase()
const isWX = ua.indexOf('micromessenger') != -1

const APPID = 'wx34d82f12f9ab1942'

// 微信授权回调地址，直接转向服务端地址
const REDIRECT_URI = encodeURIComponent('http://www.ivcsun.com/server/app/wx/auth/callback')

import http from 'src/assets/libs/http'

export const isWeixin = isWX

export const getLocalOpenid = e => localStorage.getItem('openid')

export const setLocalOpenid = e => localStorage.setItem('openid', e)

export const authorize = async e => {
	const href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=#wechat_redirect`
	window.location.href = href
}