import { combineReducers } from 'redux'

import $$banner from './banner'
import $$product from './product'
import $$order from './order'
import $$class from './class'
import $$quick from './quick'

const reducers = {
	$$banner,
	$$product,
	$$order,
	$$class,
	$$quick,
}

export default combineReducers({
	...reducers
})