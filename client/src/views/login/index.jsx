import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'

import Layout from 'src/auto/layout'
import Input from 'src/auto/input'
import Button from 'src/auto/button'
import Toast from 'src/auto/toast'
import Alert from 'src/auto/alert'
import Loading from 'src/auto/loading'

@connect
@mass(style)
class ViewLogin extends Component {
	constructor(props) {
		super(props)

		this.state = {
			mobile: '18201938590',
			verifcode: '',
			smskey: '',
			timeout: 0
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
		console.log(123123)
	}

	mobileChange = e => {
		const v = e.target.value.trim().substr(0, 11)
		this.setState({
			mobile: v
		})
	}

	verifcodeChange = e => {
		const v = e.target.value.trim().substr(0, 6)
		this.setState({
			verifcode: v
		})
	}

	// 短信验证码拿到后的倒计时
	runTimer = e => {
		if (this.state.timeout > 0) {
			this.timer = setTimeout(e => {
				this.setState({
					timeout: this.state.timeout - 1
				})
				this.runTimer()
			}, 1000)
		}
	}
	
	// 获取短信验证码
	getVerifcode = async e => {
		const mobile = this.state.mobile

		if (!mobile) {
			Toast.show('请输入手机号')
			return false
		}
		else if (!(/^1[0-9]{10}$/).test(mobile)) {
			Toast.show('请输入正确的手机号')
			return false
		}

		Loading.show()
		try {
			const res = await this.props.$user.verifcode({
				mobile
			})
			this.setState({
				smskey: res.smskey,
				timeout: 60
			}, this.runTimer)
			Alert.show('您的验证码(上线后该提示应为短信)=' + res.verifcode)
		} catch(e) {
			Toast.show(e.msg)
		}
		Loading.hide()
	}
	
	// 提交登录
	submit = async e => {
		const mobile = this.state.mobile
		const verifcode = this.state.verifcode
		const smskey = this.state.smskey

		if (!mobile) {
			Toast.show('请输入手机号')
		}
		else if (!(/^1[0-9]{10}$/).test(mobile)) {
			Toast.show('请输入正确的手机号')
		}
		else if (!smskey) {
			Toast.show('请获取验证码')
		}
		else if (!verifcode) {
			Toast.show('请输入验证码')
		}
		else {
			Loading.show()
			try {
				const token = await this.props.$user.login({
					mobile,
					verifcode,
					smskey
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
				<Layout.Header title="账户登录" ghost />

				<Layout.Body styleName="body">

					<h1 styleName="logo">LOGO</h1>
				
					<Input
						type="tel"
						value={this.state.mobile}
						onChange={this.mobileChange}
						styleName="mobile"
						addonBefore={<i />}
						placeholder="请输入手机号" />
					
					<Input
						type="number"
						value={this.state.verifcode}
						onChange={this.verifcodeChange}
						styleName="code"
						addonBefore={<i />}
						addonAfter={
							<a href="javascript:;"
								styleName={
									this.state.timeout ?
									'code-btn disabled' :
									'code-btn'
								}
								onClick={this.getVerifcode}
							>
								{
									this.state.timeout > 0 ?
									this.state.timeout + '秒后重试' :
									'获取验证码'
								}
							</a>
						}
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