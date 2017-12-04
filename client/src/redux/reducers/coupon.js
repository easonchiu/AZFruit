import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: []
})

const reducer = handleActions({
	COUPON_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload.list
		})
	}
}, initialState)

export default reducer