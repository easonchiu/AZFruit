import './style'
import React from 'react'
import classnames from 'classnames'

import {Icon} from '../'

const Radio = props => {
	const css = classnames('x-radio', {
		'x-radio__checked': props.checked
	}, props.className)
	return (
		<i className={css}><Icon type="check" /></i>
	)
}

export default Radio