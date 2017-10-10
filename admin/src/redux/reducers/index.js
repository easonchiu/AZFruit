import { combineReducers } from 'redux'

import $$banner from './banner'
import $$product from './product'
import $$order from './order'

const reducers = {
	$$banner,
	$$product,
	$$order,
}

export default combineReducers({
	...reducers
})