import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchRecommendList = createAction('GOODS_FETCH_RECOMMEND_LIST')
const _fetchList = createAction('GOODS_FETCH_LIST')
const _fetchRecomList = createAction('GOODS_FETCH_RECOM_LIST')
const _fetchDetail = createAction('GOODS_FETCH_DETAIL')
const _fetchSku = createAction('GOODS_FETCH_SKU')

// 获取首页推荐的产品
const fetchRecommendList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/recommend/list`,
        params: {}
	})
	dispatch(_fetchRecommendList(res))
}

// 按分类获取产品
const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/list`,
        params: {
        	category: payload
        }
	})
	dispatch(_fetchList(res))
}

// 获取产品top10
const fetchTop10List = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/recom/list`,
        params: {
        	category: payload
        }
	})
	dispatch(_fetchRecomList(res))
}

// 获取产品详情
const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/detail/${payload}`,
        params: {}
	})
	dispatch(_fetchDetail(res))
}

// 获取产品规格
const fetchSku = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/sku/${payload}`,
        params: {}
	})
	dispatch(_fetchSku(res))
}

// 清除产品列表
const clear = createAction('GOODS_CLEAR')

export default {
	fetchRecommendList,
	fetchList,
	fetchRecomList,
	fetchDetail,
	fetchSku,
	clear,
}