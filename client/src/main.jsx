import 'src/assets/css/reset'
import 'src/auto/base'
import 'src/assets/libs/dateFormat'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import qs from 'qs'

// 是否微信
import { isWeixin } from 'src/assets/libs/wxoauth'

// fastclick
import fastclick from 'fastclick'
fastclick.attach(document.body)

// store
import configureStore from 'src/redux/store'
const store = configureStore()

// routes
import Routers from 'src/routes'

// 外层容器
class Wrapper extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		if (!isWeixin) {
			return <p>请在微信客户端中打开</p>
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
