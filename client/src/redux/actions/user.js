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

const getTicket = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/wx/getTicket`,
        data: {
        	url: encodeURIComponent(window.location.href.split('#')[0])
        }
	})
	return res
}

export default {
	login,
	sendVerifcode,
	fetchBaseInfo,
	getTicket
}