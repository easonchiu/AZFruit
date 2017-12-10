import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'
import { setToken, getToken } from 'src/assets/libs/token'

const login = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/user/login`,
        data: payload
	})
	
	setToken(res.token)
	return getToken()
}

const sendVerifcode = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/user/verifcode`,
        data: payload
	})
	return res
}

export default {
	login,
	sendVerifcode,
}