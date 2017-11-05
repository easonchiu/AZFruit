import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	totalPrice: 0,
	count: ''
})

const reducer = handleActions({
	SHOPPINGCART_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload.list,
			totalPrice: action.payload.totalPrice,
		})
	},
	SHOPPINGCART_SET_COUNT(state, action) {
		return Immutable.merge(state, {
			count: action.payload.count
		})
	}
}, initialState)

export default reducer