import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('ORDER_FETCH_LIST');
const _fetchDetail = createAction('ORDER_FETCH_DETAIL');
const _amount = createAction('ORDER_SET_AMOUNT')

// 下单
const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/order`,
        data: payload
	})
	return res
}

// 获取我的订单列表
const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/list`,
        params: payload
	})
	dispatch(_fetchList(res))
}

// 获取我的订单详情
const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/detail/${payload.id}`,
        params: {
        	couponId: payload.couponId
        }
	})
	dispatch(_fetchDetail(res))
}

// 取消订单
const cancelOrder = payload => async (dispatch) => {
	const res = await http.request({
		method: 'patch',
        url: `/order/${payload}`,
	})
	return res
}

// 获取正在进行中的订单数量
const fetchAmount = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/amount`,
        data: payload
	})
	dispatch(_amount(res))
}

export default {
	create,
	fetchList,
	fetchDetail,
	cancelOrder,
	fetchAmount,
}