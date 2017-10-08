import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('BANNER_FETCH_LIST')

const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/banner/list`,
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
        url: `/banner/detail/${payload.id}`,
        params: {}
	})
	return res
}

const update = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/banner/detail/${payload.id}`,
        data: payload
	})
}

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/banner`,
        data: payload
	})
}


export default {
	fetchList,
	fetchDetail,
	create,
	update,
}