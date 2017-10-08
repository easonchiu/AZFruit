import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	total: 0,
	skip: 0,
	limit: 0,
})

const reducer = handleActions({
	BANNER_FETCH_LIST (state, action) {
		return Immutable.merge(state, {
			list: action.payload.list
		})
	}
}, initialState)

export default reducer