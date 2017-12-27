import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	detail: {},
	amount: ''
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
	},
	ORDER_SET_AMOUNT(state, action) {
		return Immutable.merge(state, {
			amount: action.payload.amount
		})
	}
}, initialState)

export default reducer