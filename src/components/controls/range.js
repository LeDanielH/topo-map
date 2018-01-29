import React from 'react'
import mapActions from '../../redux/actions'
import {mapOptions} from '../../config/world-map-options'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import '../../styles/topo-map-controls/range.css'

const Range = ({centerLong, centerLat, latMin, latMax, longMin, longMax, setMapPositionParameters, zoomStates}) => {
	const {rangeIncrement} = mapOptions;

	const handleRange = ({target:{value}}, coordType) => {
		let centerCoords;
		if (coordType === 'lat') {
			centerCoords = {
				centerLong,
				centerLat: parseFloat(value)
			};
		} else if (coordType === 'long') {
			centerCoords = {
				centerLat,
				centerLong: parseFloat(value)
			};
		}
		return setMapPositionParameters(false, centerCoords, zoomStates);
	};

	return (
		<div className='tm__range'>
			<div className='tm__range-wrapper'>
				<input type='range'
				       min={latMin}
				       max={latMax}
				       value={parseFloat(centerLat)}
				       step={parseInt(rangeIncrement, 10)}
				       onChange={(e) => handleRange(e, 'lat')}
				/>
			</div>
			<div className='tm__range-wrapper'>
				<input type='range'
				       min={longMin}
				       max={longMax}
				       value={parseFloat(centerLong)}
				       step={parseInt(rangeIncrement, 10)}
				       onChange={(e) => handleRange(e, 'long')}
				/>
			</div>
		</div>
	)
};

const mapStateToProps = ({topoMap: {centerLong, centerLat, latMin, latMax, longMin, longMax}}) => {
	return {
		centerLong,
		centerLat,
		latMin,
		latMax,
		longMin,
		longMax
	};
};

const mapDispatchToProps = dispatch => {
	const dispatchedMapActions = bindActionCreators(mapActions, dispatch);
	return { setMapPositionParameters: dispatchedMapActions.setMapPositionParameters};
};

export default connect(mapStateToProps, mapDispatchToProps)(Range);
