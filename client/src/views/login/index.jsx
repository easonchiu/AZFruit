import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import Layout from 'src/auto/layout'
import Input from 'src/auto/input'
import Button from 'src/auto/button'

@connect
@mass(style)
@stateData
class ViewLogin extends Component {
	constructor(props) {
		super(props)

		this.setData({
			mobile: '',
			vercode: ''
		})
	}

	mobileChange = e => {
		const v = e.target.value.trim().substr(0, 11)
		this.data.mobile = v
	}

	vercodeChange = e => {
		const v = e.target.value.trim().substr(0, 6)
		this.data.vercode = v
	}

	submit = e => {
		const mobile = this.data.mobile
		const vercode = this.data.vercode

		
	}

	render() {
		return (
			<Layout styleName="view-login">
				<Layout.Header title="登录" ghost />

				<Layout.Body styleName="body">
				
					<Input
						type="tel"
						value={this.data.mobile}
						onChange={this.mobileChange}
						styleName="mobile"
						addonBefore={<p>手机号</p>}
						placeholder="请输入手机号" />
					
					<Input
						type="number"
						value={this.data.vercode}
						onChange={this.vercodeChange}
						styleName="code"
						addonBefore={<p>验证码</p>}
						addonAfter={<p>获取验证码</p>}
						placeholder="请输入验证码" />

					<Button styleName="button"
						onClick={this.data.submit}>
						登录
					</Button>

				</Layout.Body>
			</Layout>
		)
	}
}

export default ViewLogin