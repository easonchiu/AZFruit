import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchRecommendList = createAction('GOODS_FETCH_RECOMMEND_LIST')
const _fetchList = createAction('GOODS_FETCH_LIST')
const _fetchTop10List = createAction('GOODS_FETCH_TOP10_LIST')
const _fetchDetail = createAction('GOODS_FETCH_DETAIL')
const _fetchSpec = createAction('GOODS_FETCH_SPEC')

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

// 获取产品top10
const fetchTop10List = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/product/top10/list`,
        params: {
        	category: payload
        }
	})
	dispatch(_fetchTop10List(res))
}

// 获取产品详情
const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/product/detail/${payload}`,
        params: {}
	})
	dispatch(_fetchDetail(res))
}

// 获取产品规格
const fetchSpec = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/product/spec/${payload}`,
        params: {}
	})
	dispatch(_fetchSpec(res))
}

// 清除产品列表
const clear = createAction('GOODS_CLEAR')

export default {
	fetchRecommendList,
	fetchList,
	fetchTop10List,
	fetchDetail,
	fetchSpec,
	clear,
}