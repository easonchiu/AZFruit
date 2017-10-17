import './style'
import React, { Component } from 'react'
import classnames from 'classnames'

const Layout = props => {
	const css = classnames(
		'x-app',
		props.className,
	)
	if (props.visible === false) {
		return null
	}
	return (
		<div className={ css }>
			{ props.children }
		</div>
	)
}

const LayoutBody = props => {
	const css = classnames(
		'x-app-body',
		props.className,
		{
			'x-app-body--loading': props.loading,
			'x-app-body--error': props.errorInfo,
		}
	)
	return (
		<main className={ css } style={ props.style }>
			{
				props.loading ?
				<div className="x-app__loading">
					<svg className="x-app__loading_circular" viewBox="25 25 50 50">
						<circle className="x-app__loading_path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
					</svg>
				</div> :
				props.errorInfo ?
				<p className="x-app__error-info"><i>!</i>{props.errorInfo}</p> :
				props.children
			}
		</main>
	)
}

const LayoutFooter = props => {
	const css = classnames(
		'x-app-footer',
		props.className,
	)
	if (props.visible === false) {
		return null
	}
	return (
		<footer className={ css }>
			{ props.children }
		</footer>
	)
}

const LayoutHeader = props => {
	const css = classnames(
		'x-app-header',
		props.className,
	)
	const inner = classnames(
		'x-app-header__inner',
		props.innerClassName,
	)
	return (
		<header className={css} style={props.style}>
			<div className={inner}>
				{ props.addonBefore ? <div className="x-app-header__addon-before">{ props.addonBefore }</div> : null }
				{ props.title ? <h1 className="x-app-header__title">{ props.title }</h1> : null }
				{ props.children }
				{ props.addonAfter ? <div className="x-app-header__addon-after">{ props.addonAfter }</div> : null }
			</div>
			{ props.addonBottom ? <div className="x-app-header__addon-bottom">{ props.addonBottom }</div> : null }
		</header>
	)
}

Layout.Header = LayoutHeader
Layout.Body = LayoutBody
Layout.Footer = LayoutFooter
export default Layout