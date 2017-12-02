import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('GOODS_FETCH_LIST')
const _fetchRanking = createAction('GOODS_FETCH_RANKING')
const _fetchRecom = createAction('GOODS_FETCH_RECOM')

// 获取商品列表
const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/list`,
        params: {
        	skip: payload.skip || 0,
        	limit: payload.limit || 10,
        }
	})
	dispatch(_fetchList(res))
}

// 获取详情
const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/detail/${payload.id}`,
        params: {}
	})
	return res
}

// 获取排行榜
const fetchRanking = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/ranking`,
        params: {}
	})
	dispatch(_fetchRanking(res))
}

// 更新排行榜
const updateRanking = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/goods/ranking`,
        data: payload
	})
	return res
}

// 获取推荐榜
const fetchRecom = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/goods/recom`,
        params: {}
	})
	dispatch(_fetchRecom(res))
}

// 更新推荐榜
const updateRecom = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/goods/recom`,
        data: payload
	})
	return res
}

// 更新商品
const update = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'patch',
        url: `/goods/detail/${payload.id}`,
        data: payload
	})
}

// 创建商品
const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/goods`,
        data: payload
	})
}


export default {
	fetchList,
	fetchDetail,
	fetchRanking,
	updateRanking,
	fetchRecom,
	updateRecom,
	create,
	update,
}