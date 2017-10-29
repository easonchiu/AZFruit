import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	totalPrice: 0
})

const shoppingcart = handleActions({
	SHOPPINGCART_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload.list,
			totalPrice: action.payload.totalPrice,
		})
	}
}, initialState)

export default shoppingcart