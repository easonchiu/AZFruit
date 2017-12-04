import { combineReducers } from 'redux'

import $$category from './category'
import $$quick from './quick'
import $$banner from './banner'
import $$goods from './goods'
import $$shoppingcart from './shoppingcart'
import $$address from './address'
import $$order from './order'
import $$coupon from './coupon'

const reducers = {
	$$category,
	$$quick,
	$$banner,
	$$goods,
	$$shoppingcart,
	$$address,
	$$order,
	$$coupon,
}

export default combineReducers({
	...reducers
})