import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'
import { setToken, getToken } from 'src/assets/libs/token'

const _fetchBaseInfo = createAction('USER_BASE_INFO');

const login = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/user/login`,
        data: payload
	})
	
	setToken(res.token)
	return res
}

const sendVerifcode = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/user/verifcode`,
        data: payload
	})
	return res
}

const fetchBaseInfo = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/user`
	})
	dispatch(_fetchBaseInfo(res))
}

const getTicketAndConf = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/wx/getTicket`,
        data: {
        	url: window.location.href.split('#')[0]
        }
	})
	wx.config({
	    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: res.appId, // 必填，公众号的唯一标识
	    timestamp: res.timestamp, // 必填，生成签名的时间戳
	    nonceStr: res.nonceStr, // 必填，生成签名的随机串
	    signature: res.signature,// 必填，签名，见附录1
	    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	})
	return res
}

export default {
	login,
	sendVerifcode,
	fetchBaseInfo,
	getTicketAndConf
}