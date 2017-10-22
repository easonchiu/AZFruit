import './style'
import React, { Component } from 'react'
import { unstable_renderSubtreeIntoContainer } from 'react-dom'
import classnames from 'classnames'

import Modal from '../modal'

class Popup extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this._container = document.createElement('div')
		this._container.classList.add('_x_popup_')
        document.body.appendChild(this._container)
        this._renderContent()
        
	}

	componentWillUnmount() {
        document.body.removeChild(this._container)
    }

    componentDidUpdate() {
		this._renderContent()
	}

    _content() {
		const css = classnames('x-popup', {
			'x-popup--top': this.props.top,
		}, this.props.className)

		let children = this.props.children
		if (!Array.isArray(children)) {
			children = [children]
		}
		let hasScrollChildren = false
		children.forEach(res => {
			if (res && res.type == Scroller && !hasScrollChildren) {
				hasScrollChildren = true
			}
		})

		const innercss = classnames('x-popup__inner', {
			'x-popup--no-scroll': hasScrollChildren,
		})

		return (
			<Modal visible={this.props.visible} height={this.props.height} onBgClick={this.props.onBgClick} className={css}>
				<div className={innercss}>
					{this.props.children}
				</div>
			</Modal>
		)
    }

    _renderContent() {
		unstable_renderSubtreeIntoContainer(
			this,
			this._content(),
			this._container
		)
	}

	render() {
		return null
	}
}

const Scroller = props => {
	const css = classnames('x-popup__scroller', props.className)

	return (
		<div className={css}>
			<div className="x-popup__inscroller">{props.children}</div>
		</div>
	)
}

Popup.Scroller = Scroller

export default Popup