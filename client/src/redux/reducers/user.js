import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	data: null
})

const reducer = handleActions({
	USER_BASE_INFO(state, action) {
		return Immutable.merge(state, {
			data: action.payload
		})
	}
}, initialState)

export default reducer