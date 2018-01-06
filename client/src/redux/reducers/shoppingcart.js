import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	totalPrice: 0,
	totalWeight: 0,
	postage: 0,
	amount: ''
})

const reducer = handleActions({
	SHOPPINGCART_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload.list,
			totalPrice: action.payload.totalPrice,
			totalWeight: action.payload.totalWeight,
			postage: action.payload.postage,
		})
	},
	SHOPPINGCART_SET_AMOUNT(state, action) {
		return Immutable.merge(state, {
			amount: action.payload.amount
		})
	},
	SHOPPINGCART_CLEAR_AMOUNT(state, action) {
		return Immutable.merge(state, {
			amount: 0
		})
	}
}, initialState)

export default reducer