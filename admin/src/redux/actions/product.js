import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('PRODUCT_FETCH_LIST')

const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/product/list`,
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
        url: `/product/detail/${payload.id}`,
        params: {}
	})
	return res
}

const update = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/product/detail/${payload.id}`,
        data: payload
	})
}

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/product`,
        data: payload
	})
}


export default {
	fetchList,
	fetchDetail,
	create,
	update,
}