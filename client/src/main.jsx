import 'src/assets/css/reset'
import 'src/auto/base'
import 'src/assets/libs/dateFormat'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import qs from 'qs'

// 微信授权
import { getOpenid, authorize, getTokenWithCode, isWeixin } from 'src/assets/libs/wxoauth'

// fastclick
import initReactFastclick from 'src/assets/libs/react-fastclick'
initReactFastclick()

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

		// 获取本地openId
		const openid = getOpenid()

		if (openid) {
			this.setState({
				done: true
			})
		}
		else {
			try {
				// 获取地址中的code参数
				const search = window.location.search.replace(/^\?/, '')
				const code = qs.parse(search).code

				// 如果没有code，授权拿code
				if (!code) {
					authorize()
				}
				// 否则拿openid
				else {
					await getTokenWithCode(code)
					this.setState({
						done: true
					})
				}
			}
			catch (e) {
				console.error(e)
				alert(e.msg)
			}
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
