import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import mapActions from '../../redux/actions';
import '../../styles/topo-map-controls/controls.css'

const Controls = ({controls, children, rangeControls, toggleControls}) => {
	const handleMapControls = () => toggleControls(!controls);
	const handleMapControlsVisibility = () => controls ?  'active' :  '';

	return (
		<div className={`tm__controls ${handleMapControlsVisibility()}`}>
			<div className='tm__controls-trigger' onClick={handleMapControls}>
				<div className='tm__controls-trigger__icon'>
					<span>{'\u27a4'}</span>
				</div>
			</div>
			<div className='tm__controls-wrapper'>
				<div className='tm__compass'>
					{children}
				</div>
				{rangeControls}
			</div>
		</div>
	)
};


const mapStateToProps = state => {
	return {controls: state.topoMap.controls}
};

const mapDispatchToProps = dispatch => {
	const dispatchedMapActions = bindActionCreators(mapActions, dispatch);
	return { toggleControls: dispatchedMapActions.toggleControls} ;
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

