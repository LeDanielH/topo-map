import React from 'react';
import mapActions from '../../redux/actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {mapOptions} from  '../../config/world-map-options';
import '../../styles/topo-map-controls/pan.css'

const Pan = ({longMin, longMax, latMin, latMax, centerLong, centerLat, setMapPositionParameters, zoomStates}) => {

	const {panIncrement} = mapOptions;

	const handlePan = direction => {
		let centerCoords = {};

		switch (direction) {
			case 'left':
				if (centerLong - panIncrement <= longMin) {
					centerCoords = {
						centerLat,
						centerLong: longMin
					};
				} else {
					centerCoords = {
						centerLat,
						centerLong: centerLong - panIncrement
					};
				}
				break;
			case 'right':
				if (centerLong + panIncrement >= longMax) {
					centerCoords = {
						centerLat,
						centerLong: longMax
					};
				} else {
					centerCoords = {
						centerLat,
						centerLong: centerLong + panIncrement
					};
				}
				break;
			case 'up':
				if (centerLat + panIncrement >= latMax) {
					centerCoords = {
						centerLong,
						centerLat: latMax
					};
				} else {
					centerCoords = {
						centerLong,
						centerLat: centerLat + panIncrement
					};
				}
				break;
			case 'down':
				if (centerLat - panIncrement <= latMin) {
					centerCoords = {
						centerLong,
						centerLat: latMin
					};
				} else {
					centerCoords = {
						centerLong,
						centerLat: centerLat - panIncrement
					};
				}
				break;
			default:
				centerCoords = {
					centerLat,
					centerLong: centerLong
				};
		}
		return setMapPositionParameters(false, centerCoords, zoomStates);
	};
	return (
		<div className={'tm__pan'}>
			<div className={'tm__pan-btn'} onClick={() => handlePan('up')}/>
			<div className={'tm__pan-btn'} onClick={() => handlePan('right')}/>
			<div className={'tm__pan-btn'} onClick={() => handlePan('down')}/>
			<div className={'tm__pan-btn'} onClick={() => handlePan('left')}/>
		</div>
	)
};

const mapDispatchToProps = dispatch => {
	const dispatchedMapActions = bindActionCreators(mapActions, dispatch);
	return { setMapPositionParameters: dispatchedMapActions.setMapPositionParameters };
};

const mapStateToProps = ({topoMap: {longMin, longMax, latMin, latMax, centerLong, centerLat}}) => {
	return {
		longMin,
		longMax,
		latMin,
		latMax,
		centerLong,
		centerLat
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Pan);
