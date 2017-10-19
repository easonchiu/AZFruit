import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
	recommendList: []
})

const category = handleActions({
	GOODS_FETCH_RECOMMEND_LIST(state, action) {
		return Immutable.merge(state, {
			recommendList: action.payload
		})
	}
}, initialState)

export default category