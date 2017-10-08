import './style'
import React from 'react'


const Header = ({children}) => {
	return (
		<div className="app-header">
			{ 'header (container)' }
			{ children }
		</div>
	)
}

export default Header