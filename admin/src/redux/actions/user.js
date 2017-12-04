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

const _fetchList = createAction('USER_FETCH_LIST')

const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/user/list`,
        params: {
        	skip: payload.skip || 0,
        	limit: payload.limit || 10,
        }
	})
	dispatch(_fetchList(res))
}

const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/user/detail/${payload.id}`,
        params: {}
	})
	return res
}


export default {
	login,
	fetchList,
	fetchDetail
}