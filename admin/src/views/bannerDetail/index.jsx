import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'


@connect
@reactStateData
class ViewBannerDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			index: 0,
			link: '',
			online: false,
			uri: '',
			desc: ''
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
			const res = await this.props.$banner.fetchDetail({
				id
			})
			this.data.id = id
			this.data.index = res.index
			this.data.link = res.link
			this.data.online = res.online
			this.data.uri = res.uri
			this.data.desc = res.desc
		} catch(e) {
			console.error(e)
		}
	}

	valueChange(target, value) {
		this.data[target] = value
	}

	submit = async e => {
		try {
			if (this.data.id) {
				await this.props.$banner.update({
					id: this.data.id,
					index: this.data.index,
					link: this.data.link,
					online: this.data.online,
					uri: this.data.uri,
					desc: this.data.desc,
				})
			} else {
				await this.props.$banner.create({
					index: this.data.index,
					link: this.data.link,
					online: this.data.online,
					uri: this.data.uri,
					desc: this.data.desc,
				})
			}
			this.props.history.goBack()
		} catch(e) {
			console.error(e)
		}
	}

	render() {
		const data = this.data
		return (
			<div className="view-bannerDetail">
				<p>id:</p>
				<p>{data.id}</p>
				<hr />
				<p>index:</p>
				<input type="text" value={data.index}
					onChange={e => this.valueChange.call(this, 'index', e.target.value)} />
				<hr />
				<p>link:</p>
				<input type="text" value={data.link}
					onChange={e => this.valueChange.call(this, 'link', e.target.value)} />
				<hr />
				<p>online:</p>
				<select value={data.online}
					onChange={e => this.valueChange.call(this, 'online', e.target.value)} >
					<option value={true}>上架中</option>
					<option value={false}>已下架</option>
				</select>
				<hr />
				<p>uri:</p>
				<input type="text" value={data.uri}
					onChange={e => this.valueChange.call(this, 'uri', e.target.value)} />
				<hr />
				<p>desc:</p>
				<input type="text" value={data.desc}
					onChange={e => this.valueChange.call(this, 'desc', e.target.value)} />
				<hr />
				<button onClick={this.submit}>提交</button>
			</div>
		)
	}
}

export default ViewBannerDetail