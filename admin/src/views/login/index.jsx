import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Input, Message, Loading, Toast } from 'element-react'

@connect
@reactStateData
class ViewLogin extends Component {
	constructor(props) {
		super(props)

		this.setData({
			username: '',
			password: '',
			loading: false
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	valueChange(e, target) {
		this.data[e] = target
	}

	submit = async e => {
		if (!this.data.username) {
			Message.error('请输入用户名')
			return false
		}
		else if (!this.data.password) {
			Message.error('请输入密码')
			return false	
		}
		else {
			this.data.loading = true
			try {
				await this.props.$user.login({
					username: this.data.username,
					password: this.data.password,
				})
				this.props.history.push('/banner/list')
			} catch(e) {
				Message.error(e.msg || '系统错误')
			}
			this.data.loading = false
		}
	}

	render() {
		return (
			<div className="view-login">
				<div className="mask"></div>

				<div className="login-box">
					<Loading loading={this.data.loading}>
						<h1>用户登录</h1>
						<Input
							value={this.data.username}
							onChange={this.valueChange.bind(this, 'username')}
							placeholder="用户名" />
						<Input
							type="password"
							autoComplete="new-password"
							value={this.data.password}
							onChange={this.valueChange.bind(this, 'password')}
							placeholder="密码" />
						<Button type="primary" onClick={this.submit} size="large">登录</Button>
					</Loading>
				</div>
				
			</div>
		)
	}
}

export default ViewLogin