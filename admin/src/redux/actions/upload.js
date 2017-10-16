import { createAction } from 'redux-actions'
import http from 'src/assets/libs/http'

const _fetchList = createAction('UPLOAD_FETCH_LIST')

const fetchList = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'get',
        url: `/upload/list`,
        params: {
            classes: payload.class || '',
        	skip: payload.skip || 0,
        	limit: payload.limit || 10,
        }
	})
	dispatch(_fetchList(res))
}

const upload = (payload = {}) => async (dispatch, getState) => {
	const res = await http.request({
		method: 'post',
        url: `/upload`,
        data: {
        	base64: payload.base64,
        	class: payload.class,
        }
	})
    return res
}

export default {
	fetchList,
	upload,
}