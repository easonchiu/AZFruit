import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	detail: {},
	default: undefined
})

const reducer = handleActions({
	ADDRESS_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload.list,
			default: action.payload.default
		})
	},
	ADDRESS_FETCH_DETAIL(state, action) {
		return Immutable.merge(state, {
			detail: action.payload,
		})
	},
}, initialState)

export default reducer