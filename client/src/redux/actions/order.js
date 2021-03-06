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
	return res.orderNo
}

// 获取我的订单列表
const fetchList = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order`,
        params: payload
	})
	dispatch(_fetchList(res))
}

// 获取我的订单详情
const fetchDetail = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/order/${payload.id}`,
        params: {
        	couponId: payload.couponId,
        	flag: payload.flag
        }
	})
	dispatch(_fetchDetail(res))
}

// 取消订单
const cancelOrder = payload => async (dispatch) => {
	const res = await http.request({
		method: 'delete',
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

// 支付订单
const paymentOrder = payload => async (dispatch) => {
	const res = await http.request({
		method: 'post',
        url: `/order/${payload.id}/payment`,
        data: payload
	})
	return res
}

// 查询订单状态
const queryStatus = payload => async (dispatch) => {
	const res = await http.request({
		method: 'post',
        url: `/wx/unifiedorder/status`,
        data: payload
	})
}

export default {
	create,
	fetchList,
	fetchDetail,
	cancelOrder,
	fetchAmount,
	paymentOrder,
	queryStatus,
}