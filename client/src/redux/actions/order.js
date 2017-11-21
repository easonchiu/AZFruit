import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('ORDER_FETCH_LIST');
const _fetchDetail = createAction('ORDER_FETCH_DETAIL');

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/order`,
        data: payload
	})
	return res
}

const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/list`,
        params: payload
	})
	dispatch(_fetchList(res))
}

const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/detail/${payload}`,
	})
	dispatch(_fetchDetail(res))
}


export default {
	create,
	fetchList,
	fetchDetail,
}