import _ from 'lodash';
import actions from '../config/actions';

const initialState = {
	zoom: null,
	centerLat: null,
	centerLong: null,
	longMax: null,
	longMin: null,
	latMax: null,
	latMin: null,
	annotationScale: 1,
	markerScale: 1,
	controls: false
};

function topoMap(state = initialState, action) {

	switch (action.type) {
		case actions.topoMap.setZoom:
			return _.assign({}, state, {
				zoom: action.payload.zoom
			});
		case actions.topoMap.toggleControls:
			return _.assign({}, state, {
				controls: action.payload.controls
			});
		case actions.topoMap.setBoundaries:
			return _.assign({}, state, {
				longMin: action.payload.longMin,
				longMax: action.payload.longMax,
				latMin: action.payload.latMin,
				latMax: action.payload.latMax
			});
		case actions.topoMap.positionMap:
			return _.assign({}, state, {
				centerLong: action.payload.centerLong,
				centerLat: action.payload.centerLat
			});
		case actions.topoMap.setAnnotationScale:
			return _.assign({}, state, {
				annotationScale: action.payload.annotationScale
			});
		case actions.topoMap.setMarkerScale:
			return _.assign({}, state, {
				markerScale: action.payload.markerScale
			});
		default:
			return state;
	}
}


export default topoMap

