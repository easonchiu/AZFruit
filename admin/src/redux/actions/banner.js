import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('BANNER_FETCH_LIST')
const _fetchDetail = createAction('BANNER_FETCH_DETAIL')

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
	// dispatch(_fetchDetail(res))
}

export default {
	fetchList,
	fetchDetail,
}