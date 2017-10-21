import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	recommendList: [],
	list: []
})

const goods = handleActions({
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
	}
}, initialState)

export default goods