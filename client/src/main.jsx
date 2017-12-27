import 'src/assets/css/reset'
import 'src/auto/base'
import 'src/assets/libs/dateFormat'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import qs from 'qs'

// 微信授权
import { getLocalOpenid, authorize, setLocalOpenid, isWeixin } from 'src/assets/libs/wxoauth'

// fastclick
import fastclick from 'fastclick'
fastclick.attach(document.body)

// store
import configureStore from 'src/redux/store'
const store = configureStore()

// routes
import Routers from 'src/routes'

// 外层容器，用于获取openid，拿到后显示app
class Wrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			done: false
		}
	}

	async componentWillMount() {
		// 如果不在微信中打开，啥也不请求
		if (!isWeixin) {
			return false
		}

		// 获取地址中的openid
		const search = window.location.hash ?
			window.location.hash.split('?')[1] :
			window.location.search.replace(/^\?/, '')
		const openid = qs.parse(search).openid

		// 获取本地openId
		const localOpenid = getLocalOpenid()

		if (openid || localOpenid) {
			setLocalOpenid(openid || localOpenid)
			this.setState({
				done: true
			})
		}
		else {
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
	process.env.ENV_NAME === 'production' ?
	<Wrapper /> :
	<Provider store={store}>
		<Routers />
	</Provider>,
	document.getElementById('root')
)
