import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('COUPON_FETCH_LIST')

const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/coupon/list`,
        params: {}
	})
	dispatch(_fetchList(res))
}

export default {
	fetchList,
}