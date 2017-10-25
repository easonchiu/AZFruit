import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Loading, Message, Select, Toast, Table } from 'element-react'
import Colors from 'src/components/colors'
import Upload from 'src/components/upload'
import CDN from 'src/assets/libs/cdn'

@connect
@reactStateData
class ViewProductDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			loading: true,

			name: '',
			cover: '',
			index: 0,
			desc: '',
			isImport: false,
			origin: '',
			category: [],
			classNames: [],
			badge: '',
			badgeColor: '',
			imgs: [],
			detail: '',
			atIndex: false,
			online: false,
			parameter: [],
			parameterEdit: null,
			parameterEditName: '',
			parameterEditValue: ''
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		const id = this.props.match.params.id
		if (id) {
			this.fetch(id)
		} else {
			this.fetch(false)
		}
	}

	async fetch(id) {
		try {
			if (id) {
				const res = await this.props.$product.fetchDetail({
					id
				})

				const data = {}

				data.id = id
				data.name = res.name
				data.cover = res.cover
				data.index = res.index
				data.desc = res.desc
				data.parameter = res.parameter || []
				data.isImport = res.isImport
				data.origin = res.origin
				data.category = res.category
				data.badge = res.badge
				data.badgeColor = res.badgeColor
				data.imgs = res.imgs
				data.detail = res.detail
				data.atIndex = res.atIndex
				data.online = res.online
				data.classNames = res.category.map(res => res.id)

				this.setState({
					...data
				})
			}

			await this.props.$category.fetchOnlineList()
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	valueChange(target, value) {
		this.data[target] = value
	}

	submit = async e => {
		this.data.loading = true
		try {
			const data = {
				name: this.data.name,
				cover: this.data.cover,
				index: this.data.index,
				desc: this.data.desc,
				parameter: this.data.parameter,
				isImport: this.data.isImport,
				origin: this.data.origin,
				category: this.data.category,
				badge: this.data.badge,
				badgeColor: this.data.badgeColor,
				imgs: this.data.imgs,
				detail: this.data.detail,
				atIndex: this.data.atIndex,
				online: this.data.online,
			}
			if (this.data.id) {
				await this.props.$product.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$product.create(data)
			}
			this.props.history.goBack()
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	changeClass = e => {
		const onlineList = this.props.$$category.onlineList

		const res = e.map(res => {
			for (let i = 0; i < onlineList.length; i++) {
				if (onlineList[i].id == res) {
					return onlineList[i]
				}
			}
		})

		this.data.category = res
	}

	appendParameter = e => {
		if (this.data.parameterEdit != null) {
			Message.error('请先保存正在编辑中的参数')
			return false
		}
		const newPar = {
			name: '',
			value: '',
		}
		this.data.parameter.push(newPar)
		this.data.parameterEdit = newPar
	}

	deleteParameter = e => {
		this.data.parameter.forEach((res, i) => {
			if (res == e) {
				this.data.parameter.splice(i, 1)
			}
		})
		this.setState({
			parameterEditValue: '',
			parameterEditName: '',
			parameterEdit: null
		})
	}

	saveParameter = e => {
		const name = this.data.parameterEditName.trim()
		const value = this.data.parameterEditValue.trim()
		
		if (name == '') {
			Message.error('键不能为空')
			return false
		} else if (value == '') {
			Message.error('值不能为空')
			return false
		}
		
		this.data.parameterEdit.name = name
		this.data.parameterEdit.value = value

		this.setState({
			parameterEditValue: '',
			parameterEditName: '',
			parameterEdit: null
		})
	}

	editParameter = e => {
		if (this.data.parameterEdit != null) {
			Message.error('请先保存正在编辑中的参数')
			return false
		}
		this.setState({
			parameterEditValue: e.value,
			parameterEditName: e.name,
			parameterEdit: e
		})
	}

	moveParameter = e => {
		this.data.parameter.forEach((res, i) => {
			if (res == e) {
				this.data.parameter.splice(i, 1)
				this.data.parameter.splice(i-1, 0, e)
			}
		})
		this.setState({})
	}

	editParameterChange = (m, v) => {
		if (m === 'name') {
			this.data.parameterEditName = v
		} else {
			this.data.parameterEditValue = v
		}
	}

	appendSwipeImgs = e => {
		if (this.data.imgs.includes(e)) {
			Message.error('已存在相同图片')
			return false
		}
		this.data.imgs.push(e)
		this.setState({})
	}

	moveSwipeImgs = e => {
		this.data.imgs.forEach((res, i) => {
			if (res == e) {
				this.data.imgs.splice(i, 1)
				this.data.imgs.splice(i-1, 0, e)
			}
		})
		this.setState({})
	}

	deleteSwipeImgs = e => {
		this.data.imgs.forEach((res, i) => {
			if (res == e) {
				this.data.imgs.splice(i, 1)
			}
		})
		this.setState({})
	}

	render() {
		const data = this.data

		const onlineList = this.props.$$category.onlineList

		return (
			<div className="view-productDetail">

				<h1>产品管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>
					<Form.Item label="排序">
						<InputNumber
							defaultValue={this.data.index}
							value={this.data.index}
							onChange={this.valueChange.bind(this, 'index')} />
					</Form.Item>

					<Form.Item label="封面图">
						<Upload
							maxWidth={350}
							classes="cover"
							value={this.data.cover}
							onChange={this.valueChange.bind(this, 'cover')} />
							<span>封面图片尺寸：350 x 350 像素</span>
					</Form.Item>

					<Form.Item label="轮播图">
						<Table
							className="swipeimgsTable"
							style={{width:'600px', marginBottom:'10px'}}
							border
							columns={[{
								type: 'index'
							}, {
								label: '图片',
								render: e => {
									return <img src={CDN + e} />
								}
							}, {
								label: '',
								width: 160,
								align: 'center',
								render: e => {
									return <p className="console">
										{
											e != this.data.imgs[0] ?
											<a href="javascript:;" onClick={this.moveSwipeImgs.bind(this, e)}>
												上移
											</a> :
											null
										}
										<a href="javascript:;" onClick={this.deleteSwipeImgs.bind(this, e)}>
											删除
										</a>
									</p>
								}
							}]}
							data={this.data.imgs} />
						<Upload
							className="swipeimgs"
							maxWidth={700}
							classes="goods"
							value=""
							onChange={this.appendSwipeImgs} />
						<span>轮播图片尺寸：700 x 700 像素</span>
					</Form.Item>

					<Form.Item label="产品名称">
						<Input
							value={this.data.name}
							onChange={this.valueChange.bind(this, 'name')} />
					</Form.Item>

					<Form.Item label="产品描述">
						<Input
							value={this.data.desc}
							onChange={this.valueChange.bind(this, 'desc')} />
					</Form.Item>

					<Form.Item label="产品参数">
						<Table
							style={{width:'600px',marginBottom:'10px'}}
							border
							columns={[{
								type: 'index'
							}, {
								label: '名称',
								width: 180,
								render: e => {
									if (e == this.data.parameterEdit) {
										return <Input onChange={this.editParameterChange.bind(this, 'name')}
											size="small" value={this.data.parameterEditName} />
									}
									return e.name
								}
							}, {
								label: '值',
								render: e => {
									if (e == this.data.parameterEdit) {
										return <Input onChange={this.editParameterChange.bind(this, 'value')}
											size="small" value={this.data.parameterEditValue} />
									}
									return e.value
								}
							}, {
								label: '',
								width: 160,
								align: 'center',
								render: e => {
									return <p className="console">
										{
											e == this.data.parameterEdit ?
											<a href="javascript:;" onClick={this.saveParameter.bind(this, e)}>保存</a> :
											<a href="javascript:;" onClick={this.editParameter.bind(this, e)}>编辑</a>
										}
										{
											e != this.data.parameter[0] ?
											<a href="javascript:;" onClick={this.moveParameter.bind(this, e)}>
												上移
											</a> :
											null
										}
										<a href="javascript:;" onClick={this.deleteParameter.bind(this, e)}>
											删除
										</a>
									</p>
								}
							}]}
							data={this.data.parameter} />
						<Button onClick={this.appendParameter}>添加</Button>
					</Form.Item>

					<Form.Item label="详情">
						<Input
							value={this.data.detail}
							onChange={this.valueChange.bind(this, 'detail')} />
					</Form.Item>

					<Form.Item label="产地">
						<Input
							value={this.data.origin}
							onChange={this.valueChange.bind(this, 'origin')} />
					</Form.Item>

					<Form.Item label="优质产区">
						<Switch
							value={this.data.isImport}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'isImport')} />
					</Form.Item>

					<Form.Item label="所属分类">
						<Select className="classSelect"
							value={this.data.classNames}
							onChange={this.changeClass}
							multiple={true}>
						{
							onlineList.map(res => {
								return (
									<Select.Option key={res.id} label={res.name} value={res.id} />
								)
							})
						}
						</Select>
					</Form.Item>

					<Form.Item label="标签文字">
						<Input
							value={this.data.badge}
							onChange={this.valueChange.bind(this, 'badge')} />
					</Form.Item>

					<Form.Item label="标签文字底色">
						<Colors
							value={this.data.badgeColor}
							onChange={this.valueChange.bind(this, 'badgeColor')} />
					</Form.Item>

					<Form.Item label="是否首页推荐">
						<Switch
							value={this.data.atIndex}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'atIndex')} />
					</Form.Item>

					<Form.Item label="上下架">
						<Switch
							value={this.data.online}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'online')} />
						<em>设置为下架后，所有规格均下架</em>
					</Form.Item>
				</Form>

				<div className="btns">
					<Button type="primary" size="large" onClick={this.submit}>提交</Button>
					<Button size="large" onClick={this.props.history.goBack}>取消</Button>
				</div>

				</Loading>

			</div>
		)
	}
}

export default ViewProductDetail