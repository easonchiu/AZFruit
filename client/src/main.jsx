import 'src/assets/css/reset'
import 'src/auto/base'
import 'src/assets/libs/dateFormat'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

// 微信授权
import { getOpenid, authorize, isWeixin } from 'src/assets/libs/wxoauth'

// fastclick
import initReactFastclick from 'src/assets/libs/react-fastclick'
initReactFastclick()

// store
import configureStore from 'src/redux/store'
const store = configureStore()

// routes
import Routers from 'src/routes'

class Wrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			done: false
		}
	}

	componentWillMount() {
		const openid = getOpenid()
		if (openid) {
			this.setState({
				done: true
			})
		}
		else if (isWeixin) {
			authorize()
		}
	}

	render() {
		if (!isWeixin) {
			return <p>请在微信客户端中打开</p>
		}
		else if (!this.state.done) {
			return null
		}
		return (
			<Provider store={store}>
				<Routers />
			</Provider>
		)
	}
}


// render to #root
render(
	<Wrapper />,
	document.getElementById('root')
)
