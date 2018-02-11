import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('ORDER_FETCH_LIST')

const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/list`,
        params: {
        	type: payload.type,
        	skip: payload.skip || 0,
        	limit: payload.limit || 10,
        }
	})
	dispatch(_fetchList(res))
}

const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/detail/${payload.id}`,
        params: {}
	})
	return res
}

const setStatus = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/order/${payload.id}/status`,
        data: {
        	status: payload.status,
        	statusMark: payload.statusMark
        }
	})
	return res
}



export default {
	fetchList,
	fetchDetail,
	setStatus,
}