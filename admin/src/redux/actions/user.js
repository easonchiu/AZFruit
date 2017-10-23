import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const login = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/adminuser/login`,
        data: payload
	})
	sessionStorage.setItem('token', res.token)
}


export default {
	login
}