import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchRecommendList = createAction('GOODS_FETCH_RECOMMEND_LIST');


const fetchRecommendList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/product/recommend_list`,
        params: {}
	})
	dispatch(_fetchRecommendList(res))
}

export default {
	fetchRecommendList,
}