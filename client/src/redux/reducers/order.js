import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	detail: {}
})

const reducer = handleActions({
	ORDER_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload
		})
	},
	ORDER_FETCH_DETAIL(state, action) {
		return Immutable.merge(state, {
			detail: action.payload
		})
	}
}, initialState)

export default reducer