import { combineReducers } from 'redux'

import $$category from './category'
import $$quick from './quick'
import $$banner from './banner'
import $$goods from './goods'

const reducers = {
	$$category,
	$$quick,
	$$banner,
	$$goods,
}

export default combineReducers({
	...reducers
})