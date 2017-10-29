import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('SHOPPINGCART_FETCH_LIST');
const _count = createAction('SHOPPINGCART_SET_COUNT');

const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/shoppingcart/list`,
        params: {}
	})
	dispatch(_fetchList(res))
}

const update = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/shoppingcart`,
        data: payload
	})
	return res
}

const remove = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'delete',
        url: `/shoppingcart`,
        data: payload
	})
	return res
}

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/shoppingcart`,
        data: payload
	})
	return res
}

const count = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/shoppingcart/count`,
        data: payload
	})
	dispatch(_count(res))
}

export default {
	fetchList,
	update,
	remove,
	create,
	count,
}