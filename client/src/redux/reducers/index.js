import { combineReducers } from 'redux'

import $$category from './category'
import $$quick from './quick'
import $$banner from './banner'
import $$goods from './goods'
import $$shoppingcart from './shoppingcart'

const reducers = {
	$$category,
	$$quick,
	$$banner,
	$$goods,
	$$shoppingcart,
}

export default combineReducers({
	...reducers
})