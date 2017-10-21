import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	list: []
})

const banner = handleActions({
	BANNER_FETCH_LIST(state, action) {
		return Immutable.merge(state, {
			list: action.payload
		})
	}
}, initialState)

export default banner