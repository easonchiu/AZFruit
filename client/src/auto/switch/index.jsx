import './style'
import React from 'react'
import classnames from 'classnames'

const Switch = props => {
	const io = props.i !== undefined && props.o !== undefined
	const css = classnames('x-switch', {
		'x-switch--active': props.value,
		'x-switch--io': io
	}, props.className)
	return (
		<a href="javascript:;" className={css} onClick={props.onChange}>
			{
				io ? <i>{props.i}</i> : null
			}
			{
				io ? <o>{props.o}</o> : null
			}
			<em></em>
		</a>
	)
}

export default Switch