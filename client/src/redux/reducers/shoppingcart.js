import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	address: {},
	totalPrice: 0,
	totalWeight: 0,
	postagePrice: 0,
	amount: ''
})

const reducer = handleActions({
	SHOPPINGCART_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload.list,
			address: action.payload.address,
			totalPrice: action.payload.totalPrice,
			totalWeight: action.payload.totalWeight,
			postagePrice: action.payload.postagePrice,
		})
	},
	SHOPPINGCART_SET_AMOUNT(state, action) {
		return Immutable.merge(state, {
			amount: action.payload.amount
		})
	}
}, initialState)

export default reducer