import './style'
import React, { cloneElement } from 'react'
import classnames from 'classnames'

import {Icon} from '../'

const CellRow = props => {
	const css = classnames('x-cell__row', {
		'x-cell--arrow': props.arrow,
		'x-cell--activeable': props.arrow || props.onClick || props.activeable
	},props.className)
	return (
		<div className={css} style={props.style}
			onClick={e => props.onClick !== undefined && props.onClick(props.value)}>
			{ props.children }
			{
				props.arrow ?
				<Icon type="right" className="x-cell__arrow" /> :
				null
			}
		</div>
	)
}


const Cell = props => {
	const css = classnames('x-cell', props.className)
	let children = props.children

	if (typeof props.onClick === 'function') {
		if (!Array.isArray(children)) {
			children = [children]
		}
		children = children.map((res, index) => {
			const value =
				res.props.value !== undefined ?
				res.props.value :
				res.key !== undefined ?
				res.key.replace(/^\.\$/g, '') :
				''
			
			return cloneElement(res, {
				value,
				key: index,
				onClick: props.onClick
			})
		})
	}
	return (
		<section className={css}>
			{ children }
		</section>
	)
}

Cell.Row = CellRow

export default Cell