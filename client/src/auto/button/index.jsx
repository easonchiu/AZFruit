import './style'
import React from 'react'
import classnames from 'classnames'

const Button = props => {
	const type = props.type ? props.type : 'primary'
	const css = classnames('x-button', {
		'x-button--disabled': props.disabled,
		'x-button--mini': props.mini,
	}, 'x-button--' + type, props.className)
	
	let children = props.children
	if (!Array.isArray(children)) {
		children = [children]
	}

	return (
		<a className={css} style={props.style} onClick={props.onClick}>
			{
				children.map((res, i) => {
					if (typeof res !== 'object') {
						return <p key={i}>{res}</p>
					}
					return res
				})
			}
		</a>
	)
}

export default Button