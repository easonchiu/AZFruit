import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	recommendList: [],
	list: [],
	top10List: [],
	spec: [],
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
	GOODS_FETCH_TOP10_LIST(state, action) {
		return Immutable.merge(state, {
			top10List: action.payload
		})
	},
	GOODS_FETCH_DETAIL(state, action) {
		return Immutable.merge(state, {
			detail: action.payload
		})
	},
	GOODS_FETCH_SPEC(state, action) {
		return Immutable.merge(state, {
			spec: action.payload
		})
	}
}, initialState)

export default reducer