import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('SKU_FETCH_LIST')

const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/sku/list`,
        params: {
        	skip: payload.skip || 0,
        	limit: payload.limit || 10,
        	pid: payload.pid || ''
        }
	})
	dispatch(_fetchList(res))
}

const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/sku/detail/${payload.sid}`,
        params: {}
	})
	return res
}

const update = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/sku/detail/${payload.sid}`,
        data: payload
	})
}

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/sku`,
        data: payload
	})
}

const remove = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'delete',
        url: `/sku/detail/${payload.sid}`,
        data: payload
	})
}

export default {
	fetchList,
	fetchDetail,
	create,
	update,
	remove,
}