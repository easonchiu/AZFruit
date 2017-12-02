import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	count: 0,
	skip: 0,
	limit: 0,

	ranking: [],

	recom: []
})

const reducer = handleActions({
	GOODS_FETCH_LIST (state, action) {
		return Immutable.merge(state, {
			list: action.payload.list,
			count: action.payload.count,
			skip: action.payload.skip,
			limit: action.payload.limit
		})
	},
	GOODS_FETCH_RANKING (state, action) {
		const ranking = action.payload.map((res, i) => ({...res, index: i + 1}))
		return Immutable.merge(state, {
			ranking
		})
	},
	GOODS_FETCH_RECOM (state, action) {
		const recom = action.payload.map((res, i) => ({...res, index: i + 1}))
		return Immutable.merge(state, {
			recom
		})
	}
}, initialState)

export default reducer