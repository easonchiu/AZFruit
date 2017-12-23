import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('SHOPPINGCART_FETCH_LIST');
const _amount = createAction('SHOPPINGCART_SET_AMOUNT');

const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/shoppingcart/list`,
        params: payload
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

const fetchAmount = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/shoppingcart/amount`,
        data: payload
	})
	dispatch(_amount(res))
}

const clearAmount = createAction('SHOPPINGCART_CLEAR_AMOUNT')


export default {
	fetchList,
	update,
	remove,
	create,
	fetchAmount,
	clearAmount,
}