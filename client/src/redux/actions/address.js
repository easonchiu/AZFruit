import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('ADDRESS_FETCH_LIST');

const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/address`,
        params: {}
	})
	dispatch(_fetchList(res))
}

const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/address/${payload.id}`,
        params: {}
	})
	return res
}

const update = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/address`,
        data: payload
	})
	return res
}

const remove = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'delete',
        url: `/address`,
        data: payload
	})
	return res
}

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/address`,
        data: payload
	})
	return res
}

export default {
	fetchList,
	update,
	remove,
	create,
	fetchDetail,
}