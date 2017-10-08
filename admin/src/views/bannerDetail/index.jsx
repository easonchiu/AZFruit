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

	render() {
		const data = this.data
		return (
			<div className="view-bannerDetail">
				<p>id:</p>
				<p>{data.id}</p>
				<hr />
				<p>index:</p>
				<input type="text" value={data.index} onChange={e => this.valueChange.call(this, 'index', e.target.value)} />
				<hr />
				<p>link:</p>
				<input type="text" value={data.link} onChange={e => {}} />
				<hr />
				<p>online:</p>
				<select value={data.online} onChange={e => {}}>
					<option value={true}>上架中</option>
					<option value={false}>已下架</option>
				</select>
				<hr />
				<p>uri:</p>
				<input type="text" value={data.uri} onChange={e => {}} />
				<hr />
				<p>desc:</p>
				<input type="text" value={data.desc} onChange={e => {}} />
				<hr />
				<button onClick={e => {}}>提交</button>
			</div>
		)
	}
}

export default ViewBannerDetail