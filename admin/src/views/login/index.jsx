import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Input, Message, Loading } from 'element-react'

@connect
@reactStateData
class ViewLogin extends Component {
	constructor(props) {
		super(props)

		this.setData({
			username: '',
			password: ''
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	render() {
		return (
			<div className="view-login">
				<div className="login-box">
					<h1>用户登录</h1>
					<Input value={this.data.username} placeholder="用户名" />
					<Input value={this.data.password} placeholder="密码" />
					<Button type="primary" size="large">登录</Button>
				</div>
			</div>
		)
	}
}

export default ViewLogin