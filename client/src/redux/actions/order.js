import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const create = payload => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/order`,
        data: payload
	})
	return res
}

export default {
	create,
}