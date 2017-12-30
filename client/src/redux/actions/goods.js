import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchRecommendList = createAction('GOODS_FETCH_RECOMMEND_LIST')
const _fetchList = createAction('GOODS_FETCH_LIST')
const _fetchRankingList = createAction('GOODS_FETCH_RANKING_LIST')
const _fetchDetail = createAction('GOODS_FETCH_DETAIL')
const _fetchSku = createAction('GOODS_FETCH_SKU')

// 获取首页推荐的产品
const fetchRecommendList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/recommend`,
        params: {}
	})
	dispatch(_fetchRecommendList(res))
}

// 按分类获取产品
const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods`,
        params: {
        	category: payload
        }
	})
	dispatch(_fetchList(res))
}

// 获取产品top10
const fetchRankingList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/ranking`,
        params: {
        	category: payload
        }
	})
	dispatch(_fetchRankingList(res))
}

// 获取产品详情
const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/${payload}`,
        params: {}
	})
	dispatch(_fetchDetail(res))
}

// 获取产品规格列表
const fetchSku = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/${payload}/sku`,
        params: {}
	})
	dispatch(_fetchSku(res))
}

// 清除产品列表
const clear = createAction('GOODS_CLEAR')

export default {
	fetchRecommendList,
	fetchList,
	fetchRankingList,
	fetchDetail,
	fetchSku,
	clear,
}