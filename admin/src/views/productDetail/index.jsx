import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, Switch } from 'element-react'

@connect
@reactStateData
class ViewProductDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			index: 0,
			name: '',
			desc: '',
			imgs: [],
			
			price: 0,
			unit: '',
			sellCount: 0,
			online: false,
			stock: 0,

			FCLprice: 0,
			FCLunit: '',
			FCLdesc: '',
			FCLsellCount: 0,
			FCLonline: false,
			FCLstock: 0,
			
			commentList: [],
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		const id = this.props.match.params.id
		if (id) {
			this.fetch(id)
		}
	}

	async fetch(id) {
		try {
			const res = await this.props.$product.fetchDetail({
				id
			})
			this.data.id = id
			this.data.index = res.index
			this.data.name = res.name
			this.data.imgs = res.imgs
			this.data.unit = res.unit
			this.data.price = res.price
			this.data.FCLprice = res.FCLprice
			this.data.FCLdesc = res.FCLdesc
			this.data.FCLunit = res.FCLunit
			this.data.desc = res.desc
			this.data.sellCount = res.sellCount
			this.data.FCLsellCount = res.FCLsellCount
			this.data.commentList = res.commentList
			this.data.online = res.online
			this.data.FCLonline = res.FCLonline
			this.data.stock = res.stock
			this.data.FCLstock = res.FCLstock
		} catch(e) {
			console.error(e)
		}
	}

	valueChange(target, value) {
		this.data[target] = value
	}

	submit = async e => {
		try {
			const data = {
				id: this.data.id,
				index: this.data.index,
				name: this.data.name,
				imgs: this.data.imgs,
				unit: this.data.unit,
				price: this.data.price,
				FCLprice: this.data.FCLprice,
				FCLdesc: this.data.FCLdesc,
				FCLunit: this.data.FCLunit,
				desc: this.data.desc,
				sellCount: this.data.sellCount,
				FCLsellCount: this.data.FCLsellCount,
				commentList: this.data.commentList,
				online: this.data.online,
				FCLonline: this.data.FCLonline,
				stock: this.data.stock,
				FCLstock: this.data.FCLstock,
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
			console.error(e)
		}
	}

	render() {
		const data = this.data
		return (
			<div className="view-productDetail">

				<h1>产品管理</h1>
				
				<Form labelWidth={80}>
					<Form.Item label="排序">
						<Input
							value={this.data.index}
							onChange={this.valueChange.bind(this, 'index')} />
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

					<Form.Item label="产品顶图">
						{this.data.imgs.join(',')}
					</Form.Item>

					<Form.Item label="详情图">
						{this.data.imgs.join(',')}
					</Form.Item>

					<hr />

					<h6>散件</h6>
					
					<Form.Item label="计量单位">
						<Input
							value={this.data.unit}
							onChange={this.valueChange.bind(this, 'unit')} />
					</Form.Item>

					<Form.Item label="出售价格">
						<Input
							value={this.data.price}
							onChange={this.valueChange.bind(this, 'price')} />
						<p>
							单位:
							<span className="red">分</span>
							，计
							<strong className="red">{this.data.price/100}</strong>
							元
						</p>
					</Form.Item>

					<Form.Item label="库存">
						<Input
							value={this.data.stock}
							onChange={this.valueChange.bind(this, 'stock')} />
					</Form.Item>

					<Form.Item label="上下架">
						<Switch
							value={this.data.online}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'online')} />
					</Form.Item>

					<hr />

					<h6>整箱</h6>
					
					<Form.Item label="计量单位">
						<Input
							value={this.data.FCLunit}
							onChange={this.valueChange.bind(this, 'FCLunit')} />
					</Form.Item>

					<Form.Item label="整箱描述">
						<Input
							value={this.data.FCLdesc}
							onChange={this.valueChange.bind(this, 'FCLdesc')} />
					</Form.Item>

					<Form.Item label="出售价格">
						<Input
							value={this.data.FCLprice}
							onChange={this.valueChange.bind(this, 'FCLprice')} />
						<p>
							单位:
							<span className="red">分</span>
							，计
							<strong className="red">{this.data.FCLprice/100}</strong>
							元
						</p>
					</Form.Item>

					<Form.Item label="库存">
						<Input
							value={this.data.FCLstock}
							onChange={this.valueChange.bind(this, 'FCLstock')} />
					</Form.Item>

					<Form.Item label="上下架">
						<Switch
							value={this.data.FCLonline}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'FCLonline')} />
					</Form.Item>

					<Form.Item label="">
						<Button type="primary" size="large" onClick={this.submit}>提交</Button>
						<Button size="large" onClick={this.props.history.goBack}>取消</Button>
					</Form.Item>
				</Form>

			</div>
		)
	}
}

export default ViewProductDetail