import { combineReducers } from 'redux'

import $$banner from './banner'
import $$product from './product'
import $$productSpec from './productSpec'
import $$order from './order'
import $$category from './category'
import $$quick from './quick'
import $$postage from './postage'
import $$upload from './upload'

const reducers = {
	$$banner,
	$$product,
	$$productSpec,
	$$order,
	$$category,
	$$quick,
	$$postage,
	$$upload,
}

export default combineReducers({
	...reducers
})