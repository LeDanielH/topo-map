import actions from '../config/actions'

const _setBoundaries = ({longMin, longMax, latMin, latMax}) => {
	return {
		type: actions.topoMap.setBoundaries,
		payload: { longMin, longMax, latMin, latMax}
	};
};

const _positionMap = (centerLong, centerLat) => {
	return {
		type: actions.topoMap.positionMap,
		payload: { centerLong, centerLat}
	};
};

const _setZoom = (zoom) => {
	return {
		type: actions.topoMap.setZoom,
		payload: { zoom }
	};
};

const _setMarkerScale = (markerScale) => {
	return {
		type: actions.topoMap.setMarkerScale,
		payload: { markerScale }
	};
};

const _setAnnotationScale = (annotationScale) => {
	return {
		type: actions.topoMap.setAnnotationScale,
		payload: { annotationScale }
	};
};

const positionMap = ({centerLong, centerLat}, {longMin, longMax, latMin, latMax}) => {
	const isLessThanLongMin = centerLong < longMin;
	const isMoreThanLongMax = centerLong > longMax;
	const isLessThanLatMin = centerLat < latMin;
	const isMoreThanLatMax = centerLat > latMax;

	const getLongitude = () => {
		switch (true) {
			case isLessThanLongMin: return longMin;
			case isMoreThanLongMax: return longMax;
			default: return centerLong
		}
	};
	const getLatitude = () => {
		switch (true) {
			case isLessThanLatMin: return latMin;
			case isMoreThanLatMax: return latMax;
			default: return centerLat
		}
	};

	return {
		centerLong: getLongitude(),
		centerLat: getLatitude()
	};
};


const setBoundaries = (zoom, zoomStates) => {
	const isZoomState = zoomState => zoomState.zoom === zoom;
	const zoomStateBoundaries = zoomStates.find(isZoomState);
	const {longMin, longMax, latMin, latMax} = zoomStateBoundaries.boundaries;
	return {longMin, longMax, latMin, latMax}
};

const setMarkerScale = (zoom, zoomStates) => {
	const isZoomState = zoomState => zoomState.zoom === zoom;
	return zoomStates.find(isZoomState).markerScale;
};

const setAnnotationScale = (zoom, zoomStates) => {
	const isZoomState = (zoomState) => zoomState.zoom === zoom;
	return zoomStates.find(isZoomState).annotationScale;
};


const setMapPositionParameters = (zoom, {centerLong, centerLat}, zoomStates) => {
	return (dispatch, getState) => {

		const newZoom = zoom || getState().topoMap.zoom;
		dispatch(_setZoom(newZoom));

		const newBoundaries = setBoundaries(newZoom, zoomStates);
		dispatch(_setBoundaries(newBoundaries));

		const centerCoords = {
			centerLong: centerLong || getState().topoMap.centerLong,
			centerLat: centerLat || getState().topoMap.centerLat
		};

		const newPosition = positionMap(centerCoords, newBoundaries);
		dispatch(_positionMap(newPosition.centerLong, newPosition.centerLat));

		const markerScale = setMarkerScale(newZoom, zoomStates);
		dispatch(_setMarkerScale(markerScale));

		const annotationScale = setAnnotationScale(newZoom, zoomStates);
		dispatch(_setAnnotationScale(annotationScale));
	};
};

const toggleControls = (areOpen) => {
	return {
		type: actions.topoMap.toggleControls,
		payload: {controls: areOpen}
	};
};

export default {
	toggleControls,
	setMapPositionParameters
};
