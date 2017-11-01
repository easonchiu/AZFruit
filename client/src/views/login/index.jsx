import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import Layout from 'src/auto/layout'
import Input from 'src/auto/input'
import Button from 'src/auto/button'
import Toast from 'src/auto/toast'
import Loading from 'src/auto/loading'

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

	submit = async e => {
		const mobile = this.data.mobile
		const vercode = this.data.vercode

		if (!mobile) {
			Toast.show('请输入手机号')
		}
		else if (!(/^1[0-9]{10}$/).test(mobile)) {
			Toast.show('请输入正确的手机号')
		}
		else if (!vercode) {
			Toast.show('请输入验证码')
		}
		else {
			Loading.show()
			try {
				const token = await this.props.$user.login({
					mobile,
					vercode
				})
				if (token) {
					this.props.history.push('/')
				}
				else {
					Toast.show('系统错误')
				}
			}
			catch (e) {
				Toast.show(e.msg)
			}
			Loading.hide()
		}
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
						onClick={this.submit}>
						登录
					</Button>

				</Layout.Body>
			</Layout>
		)
	}
}

export default ViewLogin