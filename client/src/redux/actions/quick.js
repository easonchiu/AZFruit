import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('QUICK_FETCH_LIST');


const fetchList = payload => async (dispatch, getState) => {
	const state = getState()

	if (state.$$quick.list && state.$$quick.list.length > 0) {
		return false
	}

	const res = await http.request({
		method: 'get',
        url: `/quick`,
        params: {}
	})
	dispatch(_fetchList(res))
}

export default {
	fetchList,
}