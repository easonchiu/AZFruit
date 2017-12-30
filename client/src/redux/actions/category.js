import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('CATEGORY_FETCH_LIST');


const fetchList = payload => async (dispatch, getState) => {
	const state = getState()

	if (state.$$category.list && state.$$category.list.length > 0) {
		return false
	}

	const res = await http.request({
		method: 'get',
        url: `/category`,
        params: {}
	})
	dispatch(_fetchList(res))
}

export default {
	fetchList,
}