const ua = navigator.userAgent.toLowerCase()
export const isWeixin = ua.indexOf('micromessenger') != -1
const APPID = 'wx34d82f12f9ab1942'

export const authorize = async (token, redirect) => {
	// 微信授权回调地址，直接转向服务端地址
	const REDIRECT_URI = encodeURIComponent('http://www.ivcsun.com/server/api/wx/auth/callback?redirect=' + redirect + '&token=' + token)
	
	const href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=#wechat_redirect`
	window.location.href = href
}