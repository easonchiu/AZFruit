import './style'
import React from 'react'
import cn from 'classnames'
import CDN from 'src/assets/libs/cdn'

const GoodsItem = props => {
	const data = props.source || {}
	return (
		<div className={cn('goods-item', props.className)}>
			<div className="thumb">
				{
					data.origin && data.isImport ?
					<span className="import"><i />{data.origin}</span> :
					null
				}
				<img src={CDN+data.cover} />
			</div>
			<h1>
				{data.name}
				{
					data.badge ?
					<span className="badge">
						<em style={{backgroundColor:data.badgeColor}}>{data.badge}</em>
					</span> :
					null
				}
			</h1>
			<h6 className="price">
				<span>￥</span>
				<em>{data.price}</em>
				<span>元/{data.unit}</span>
			</h6>
			{
				data.prePrice > data.price ?
				<del>市场价 {data.prePrice}元</del> :
				null
			}
		</div>
	)
}

export default GoodsItem