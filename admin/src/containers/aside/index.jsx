import './style'
import React from 'react'

import { Link } from 'react-router-dom'

const Aside = ({children}) => {
	return (
		<div className="app-aside">
			<Link to="/banner/list">banner管理</Link>
		</div>
	)
}

export default Aside