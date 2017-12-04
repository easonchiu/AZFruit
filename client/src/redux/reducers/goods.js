import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	recommendList: [],
	list: [],
	rankingList: [],
	sku: [],
	detail: {}
})

const reducer = handleActions({
	GOODS_FETCH_RECOMMEND_LIST(state, action) {
		return Immutable.merge(state, {
			recommendList: action.payload
		})
	},
	GOODS_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload
		})
	},
	GOODS_CLEAR(state, action) {
		return Immutable.merge(state, {
			list: []
		})
	},
	GOODS_FETCH_RANKING_LIST(state, action) {
		return Immutable.merge(state, {
			rankingList: action.payload
		})
	},
	GOODS_FETCH_DETAIL(state, action) {
		return Immutable.merge(state, {
			detail: action.payload
		})
	},
	GOODS_FETCH_SKU(state, action) {
		return Immutable.merge(state, {
			sku: action.payload
		})
	}
}, initialState)

export default reducer