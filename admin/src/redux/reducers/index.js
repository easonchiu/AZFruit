import { combineReducers } from 'redux'

import $$banner from './banner'
import $$goods from './goods'
import $$sku from './sku'
import $$order from './order'
import $$category from './category'
import $$quick from './quick'
import $$postage from './postage'
import $$upload from './upload'

const reducers = {
	$$banner,
	$$goods,
	$$sku,
	$$order,
	$$category,
	$$quick,
	$$postage,
	$$upload,
}

export default combineReducers({
	...reducers
})