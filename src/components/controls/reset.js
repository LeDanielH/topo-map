import React from 'react'
import '../../styles/topo-map-controls/reset.css'

const Reset = ({resetMap, resetToDefaultLocation}) =>

	<div className='tm__reset'>
		<div onClick={resetMap} className='tm__reset-btn to-map'>
			<span>{'\u21ba'}</span>
		</div>
		<div onClick={resetToDefaultLocation} className='tm__reset-btn to-myplace' />
	</div>;

export default Reset
