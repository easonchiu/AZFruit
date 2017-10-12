import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: [],
	count: 0,
	skip: 0,
	limit: 0,
})

const reducer = handleActions({
	QUICK_FETCH_LIST (state, action) {
		return Immutable.merge(state, {
			list: action.payload.list,
			count: action.payload.count,
			skip: action.payload.skip,
			limit: action.payload.limit,
		})
	}
}, initialState)

export default reducer