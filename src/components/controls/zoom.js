import React from 'react'
import '../../styles/topo-map-controls/zoom.css'

const Zoom = ({handleZoom}) =>
	<div className={'tm__zoom'}>
		<div className={'tm__zoom-btn'} onClick={() => handleZoom('in', false)}><span>+</span></div>
		<div className={'tm__zoom-btn'} onClick={() => handleZoom('out', false)}><span>-</span></div>
	</div>;
export default Zoom;
