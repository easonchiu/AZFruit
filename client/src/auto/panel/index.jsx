import './style'
import React from 'react'
import classnames from 'classnames'

const Panel = props => {
	const css = classnames('x-panel', {

	}, props.className)
	return (
		<div className={css}>
			{ props.children }
		</div>
	)
}

export default Panel