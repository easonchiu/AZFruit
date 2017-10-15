import { combineReducers } from 'redux'

import $$banner from './banner'
import $$product from './product'
import $$productSpec from './productSpec'
import $$order from './order'
import $$class from './class'
import $$quick from './quick'
import $$postage from './postage'
import $$upload from './upload'

const reducers = {
	$$banner,
	$$product,
	$$productSpec,
	$$order,
	$$class,
	$$quick,
	$$postage,
	$$upload,
}

export default combineReducers({
	...reducers
})