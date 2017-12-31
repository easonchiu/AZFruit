import './style'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Modal extends Component {
	constructor(props) {
		super(props)

		this.state = {
			visible: false,
			ani: '',
		}
	}

	componentDidMount() {
		if (this.props.visible) {
			this._enter()
        }
	}

	componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this._enter()
        } else if (this.props.visible && !nextProps.visible) {
            this._leave()
        }
    }

    _enter() {
		this.setState({
			visible: true,
		})

        setTimeout(e => {
            this.setState({
                ani: 'enter'
            })
        })
        
        const focusdom = document.querySelector(':focus')
        if (focusdom) {
            focusdom.blur()
        }
    }

    _leave() {
    	this.setState({
			ani: 'leave'
		})
    }

    _onAnimationEnd() {
        console.log(this.state.ani)
    	if (this.state.ani === 'leave') {
            this.setState({
                visible: false,
                ani: ''
            })
        }
    }

    render() {
    	const css = classnames(
    		'x-modal',
            {
                'x-modal--enter': this.state.ani === 'enter',
                'x-modal--leave': this.state.ani === 'leave'
            },
    		this.props.className
    	)

		return (
			<div className={css} style={{display: this.state.visible ? '' : 'none'}}>
				<div className="x-modal__bg" onClick={this.props.onBgClick} />
				<div className="x-modal__inner" style={{height:this.props.height?this.props.height+'%':''}} onAnimationEnd={::this._onAnimationEnd}>
					{this.props.children}
				</div>
			</div>
		)
    }
}


export default Modal