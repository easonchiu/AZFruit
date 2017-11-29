import './style'
import React from 'react'
import cn from 'classnames'
import CDN from 'src/assets/libs/cdn'
import { Link } from 'react-router-dom'

const GoodsItem = props => {
	const data = props.source || {}
	return (
		<Link to={`/detail/${data.id}`} className={cn('goods-item', props.className)}>
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
				<em>{data.price / 100}</em>
				<span>元/{data.unit}</span>
			</h6>
			{
				data.prePrice > data.price ?
				<del>原价 {data.prePrice / 100}元</del> :
				null
			}
		</Link>
	)
}

export default GoodsItem