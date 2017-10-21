import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchRecommendList = createAction('GOODS_FETCH_RECOMMEND_LIST')
const _fetchList = createAction('GOODS_FETCH_LIST')

// 获取首页推荐的产品
const fetchRecommendList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/product/recommend/list`,
        params: {}
	})
	dispatch(_fetchRecommendList(res))
}

// 按分类获取产品
const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/product/list`,
        params: {
        	category: payload
        }
	})
	dispatch(_fetchList(res))
}

// 清除产品列表
const clear = createAction('GOODS_CLEAR')

export default {
	fetchRecommendList,
	fetchList,
	clear,
}