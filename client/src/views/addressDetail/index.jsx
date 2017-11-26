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
import Popup from 'src/auto/popup'
import Panel from 'src/auto/panel'

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
			area: '',
			areaAddress: '',
			address: '',
			default: false,
			defaultDisabled: true,
			areaPopupVisible: false,
			areaPopupValue: '',
			areaPopupList: [],
			searching: false,
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
	}

	componentDidMount() {
		if (this.id) {
			this.fetch(this.id)
		}
		else {
			const def = this.props.match.params.first == 'first'
			
			this.setState({
				default: def,
				defaultDisabled: def,
			})
		}

		AMap.plugin(['AMap.Autocomplete'], e => {
			var autoOptions = {
				city: "上海", // 城市，默认全国
				input: "keyword" // 使用联想输入的input的id
			}

			this.autocomplete = new AMap.Autocomplete(autoOptions)
	    })
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
				area: res.area,
				areaAddress: res.areaAddress,
				address: res.address,
				default: res.default,
				defaultDisabled: res.default,
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
			else if (!this.data.area) {
				Toast.show('请选择小区')
			}
			else if (!this.data.address) {
				Toast.show('请输入门牌号(例2号楼201室)')
			}
			else {
				if (this.id) {
					await this.props.$address.update({
						id: this.id,
						name: this.data.name,
						mobile: this.data.mobile,
						area: this.data.area,
						areaAddress: this.data.areaAddress,
						address: this.data.address,
						default: this.data.default,
					})
				}
				else {
					await this.props.$address.create({
						name: this.data.name,
						mobile: this.data.mobile,
						area: this.data.area,
						areaAddress: this.data.areaAddress,
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
	
	// 小区搜索结果的点击
	resultClick = e => {
		console.log(e)
		this.setState({
			areaPopupVisible: false,
			area: e.name,
			areaAddress: e.district + e.address,
		})
	}

	searchInput = e => {
		this.setState({
			areaPopupValue: e.target.value,
			searching: true
		})
		
		clearTimeout(this.searchTimeout)

		this.searchTimeout = setTimeout(() => {
			this.autocomplete &&
			this.autocomplete.search(this.data.areaPopupValue, (status, result) => {
				if (result == 'NO_PARAMS') {
					this.data.areaPopupList = []
				}
				else {
					const list = []
					if (result.tips) {
						result.tips.forEach(res => {
							if (res.address && res.address.length) {
								list.push(res)
							}
						})
					}
					this.data.areaPopupList = list
				}
				this.setState({
					searching: false
				})
			})
		}, 300)
	}

	renderAreaPopup() {
		return (
			<Popup
				visible={this.data.areaPopupVisible}
				height={100}
				styleName="area-popup"
			>
				<Layout.Header styleName="header">
					<Input
						placeholder="请输入小区名称"
						styleName="input"
						id="keyword"
						value={this.data.areaPopupValue}
						onChange={this.searchInput}
					/>
					<a href="javascript:;"
						styleName="close"
						onClick={e => this.data.areaPopupVisible = false}>
						取消
					</a>
				</Layout.Header>

				<Layout.Body styleName="body">

					{
						!this.data.searching &&
						this.data.areaPopupValue != '' &&
						this.data.areaPopupList.length ?
						<Panel styleName="box">
							<Cell styleName="result">
								{
									this.data.areaPopupList.map((res, i) => (
										<Cell.Row
											arrow
											styleName="row"
											key={i}
											value={res}
											onClick={this.resultClick}
										>
											<h6>{res.name}</h6>
											<p>{res.district}{res.address}</p>
										</Cell.Row>
									))
								}
							</Cell>
						</Panel> :
						
						!this.data.searching &&
						this.data.areaPopupValue != '' &&
						!this.data.areaPopupList.length ?

						<Panel styleName="box empty">暂无内容</Panel> :
						
						!this.data.searching &&
						this.data.areaPopupValue == '' ?
						<Panel styleName="box empty">暂无内容</Panel> :

						<Panel styleName="box empty">搜索中...</Panel>

					}

				</Layout.Body>
			</Popup>
		)
	}

	render() {
		return (
			<Layout styleName="view-address-detail">
				
				<Layout.Header
					title="地址管理"
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.backClick}
						/>
					}
					addonAfter={
						this.id ?
						<a href="javascript:;"
							styleName="delete"
							onClick={this.deleteClick}>
						</a> :
						null
					} />

				<Layout.Body
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
				
					<Cell styleName="form">
						<Cell.Row>
							<label>小区</label>
							<p
								styleName={this.data.area ? '' : 'empty'}
								onClick={e => this.data.areaPopupVisible = true}>
								{
									this.data.area ?
									this.data.area :
									'请选择小区'
								}
							</p>
						</Cell.Row>

						{this.renderAreaPopup()}

						<Cell.Row>
							<label>门牌号</label>
							<Input ghost
								placeholder="请输入"
								value={this.data.address}
								onChange={this.changeAddress}
							/>
						</Cell.Row>
					</Cell>

					<Cell styleName="form">
						<Cell.Row>
							<label>收货人姓名</label>
							<Input ghost
								placeholder="请输入收货人姓名"
								value={this.data.name}
								onChange={this.changeName}
							/>
						</Cell.Row>
						<Cell.Row>
							<label>电话号码</label>
							<Input ghost
								type="tel"
								placeholder="请输入电话号码"
								value={this.data.mobile}
								onChange={this.changeMobile}
							/>
						</Cell.Row>
					</Cell>
					

					{
						!this.data.defaultDisabled ?
						<Cell styleName="form">
							<Cell.Row styleName="defrow">
								<label>设为默认地址</label>
								<Switch value={this.data.default}
									onChange={this.changeDefault}
								/>
							</Cell.Row>
						</Cell> :
						null
					}

				</Layout.Body>
				
				<Layout.Footer styleName="footer">
					<Button onClick={this.submit}>保存</Button>
				</Layout.Footer>
			</Layout>
		)
	}
}

export default ViewAddress