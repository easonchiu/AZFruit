import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('CATEGORY_FETCH_LIST')
const _fetchOnlineList = createAction('CATEGORY_FETCH_ONLINE_LIST')

const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/category/list`,
        params: {
        	skip: payload.skip || 0,
        	limit: payload.limit || 10,
        }
	})
	dispatch(_fetchList(res))
}

const fetchOnlineList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/category/onlinelist`
	})
	dispatch(_fetchOnlineList(res))
}

const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/category/detail/${payload.id}`,
        params: {}
	})
	return res
}

const update = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/category/detail/${payload.id}`,
        data: payload
	})
}

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/category`,
        data: payload
	})
}

const remove = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'delete',
        url: `/category/detail/${payload.id}`,
	})
}


export default {
	fetchList,
	fetchOnlineList,
	fetchDetail,
	create,
	update,
	remove,
}