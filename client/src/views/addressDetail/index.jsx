import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import stateData from 'react-state-data'
import mass from 'mass'

import Layout from 'src/auto/layout'
import Button from 'src/auto/button'
import Toast from 'src/auto/toast'
import Alert from 'src/auto/alert'
import Cell from 'src/auto/cell'
import Input from 'src/auto/input'
import Switch from 'src/auto/switch'
import Loading from 'src/auto/loading'

@connect
@mass(style)
@stateData
class ViewAddress extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			name: '',
			mobile: '',
			address: '',
			default: false
		})
	}

	backClick = e => {
		this.props.history.goBack()
	}

	deleteClick = e => {
		if (!this.id) {
			return false
		}
		Alert.show({
			title: '删除地址',
			desc: '确定要删除该地址吗？',
			className: 'delete-address-alert',
			btnTextN: '取消',
			btnTextY: '删除',
			callbackY: async e => {
				Loading.show()
				try {
					await this.props.$address.remove({
						id: this.id
					})
					Toast.show('删除成功')
					this.props.history.goBack()
				} catch(e) {
					console.error(e)
					Toast.show(e.msg)
				}
				Loading.hide()
			}
		})
	}

	componentWillMount() {
		this.id = this.props.match.params.id
		this.first = this.props.match.params.first == 'first'
	}

	componentDidMount() {
		if (this.id) {
			this.fetch(this.id)
		}
		this.data.default = this.first
	}

	async fetch() {
		this.data.loading = true
		try {
			const res = await this.props.$address.fetchDetail({
				id: this.id
			})
			this.setState({
				name: res.name,
				mobile: res.mobile,
				address: res.address,
				default: res.default,
			})
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	changeName = e => {
		const val = e.target.value.trim().substr(0, 20)
		this.data.name = val
	}

	changeMobile = e => {
		const val = e.target.value.trim().substr(0, 11)
		this.data.mobile = val
	}

	changeAddress = e => {
		const val = e.target.value.trim().substr(0, 40)
		this.data.address = val
	}

	changeDefault = e => {
		this.data.default = !this.data.default
	}

	submit = async e => {
		Loading.show()
		try {
			if (!this.data.name) {
				Toast.show('请输入收货人姓名')
			}
			else if (!this.data.mobile) {
				Toast.show('请输入电话号码')
			}
			else if (!(/^1[0-9]{10}$/).test(this.data.mobile)) {
				Toast.show('请输入有效的电话号码')
			}
			else if (!this.data.address) {
				Toast.show('请输入收货地址')
			}
			else {
				if (this.id) {
					await this.props.$address.update({
						id: this.id,
						name: this.data.name,
						mobile: this.data.mobile,
						address: this.data.address,
						default: this.data.default,
					})
				}
				else {
					await this.props.$address.create({
						name: this.data.name,
						mobile: this.data.mobile,
						address: this.data.address,
						default: this.data.default,
					})
				}
				this.props.history.goBack()
			}
		} catch(e) {
			console.error(e)
			Toast.show(e.msg)
		}
		Loading.hide()
	}

	render() {
		return (
			<Layout styleName="view-address-detail">
				
				<Layout.Header
					title="地址管理"
					addonBefore={
						<a href="javascript:;" className="back" onClick={this.backClick} />
					}
					addonAfter={
						this.id ?
						<a href="javascript:;" styleName="delete" onClick={this.deleteClick}>
							删除
						</a> :
						null
					} />

				<Layout.Body
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
				
					<Cell styleName="form">
						<Cell.Row>
							<label>收货人姓名</label>
							<Input ghost
								placeholder="请输入收货人姓名"
								value={this.data.name}
								onChange={this.changeName} />
						</Cell.Row>
						<Cell.Row>
							<label>电话号码</label>
							<Input ghost
								type="tel"
								placeholder="请输入电话号码"
								value={this.data.mobile}
								onChange={this.changeMobile} />
						</Cell.Row>
						<Cell.Row>
							<label>地址</label>
							<textarea placeholder="请输入地址"
								value={this.data.address}
								onChange={this.changeAddress} />
						</Cell.Row>
						{
							!this.first ?
							<Cell.Row styleName="defrow">
								<label>设为默认地址</label>
								<Switch value={this.data.default}
									onChange={this.changeDefault} />
							</Cell.Row> :
							null
						}
					</Cell>

				</Layout.Body>
				
				<Layout.Footer styleName="footer">
					<Button onClick={this.submit}>保存</Button>
				</Layout.Footer>
			</Layout>
		)
	}
}

export default ViewAddress