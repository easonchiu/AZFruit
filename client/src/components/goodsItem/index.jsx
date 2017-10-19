import './style'
import React from 'react'
import cn from 'classnames'

const GoodsItem = props => {
	const data = props.source || {}
	return (
		<div className={cn('goods-item', props.className)}>
			<div className="thumb">
				<span className="import">进口</span>
				<img src="#" />
			</div>
			<h1>
				{data.name}
				{
					data.badge ?
					<span className="badge">{data.badge}</span> :
					null
				}
			</h1>
			<p>{data.desc}</p>
			<h6 className="price">
				<strong>￥{data.price}元/{data.unit}</strong>
				<del>市场价<span>{data.prePrice}</span></del>
			</h6>
		</div>
	)
}

export default GoodsItem