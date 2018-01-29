// Dependencies
import React, {Component}  from "react"
import {bindActionCreators} from  'redux'
import {connect} from  'react-redux'
import {scalePow} from  'd3-scale'

// React Simple Maps components
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
	Markers,
	Graticule,
	Annotations
} from  "react-simple-maps"

// Selfmade components
import Pan from  './controls/pan.js'
import Zoom from  './controls/zoom.js'
import Reset from  './controls/reset.js'
import Range from  './controls/range.js'
import Controls from  './controls/controls.js'
import MarkerPost from './markers/marker-post'
import MarkerCity from './markers/marker-city'
import AnnotationCountry from './annotations/annotation-country'

// Redux
import mapActions from  '../redux/actions'

// Map settings and options
import zoomStates from  '../config/world-zoom-states'
import annotationEdits from  '../config/world-annotations-edits'
import {getProjection, getCentroid} from  '../helpers/geo'
import {mapOptions, annotationOptions, graticuleOptions} from '../config/world-map-options'

// Data
import worldMap from '../data/maps/world-50m-withnames.topo'

// Helpers
import {getClickHandler} from "../helpers/events";
import LocalStorage from  '../helpers/localStorage';

// Styles
import '../styles/topo-map/base.css'
import '../styles/topo-map/graticule.css'
import '../styles/topo-map/geography.css'
import '../styles/topo-map/marker.css'
import '../styles/topo-map/annotation.css'


class TopoMap extends Component {

	state = {
		annotationActive: null,
		isDragging: false,
		postsLoaded: false
	};

	static defaultProps = {
		...Component.defaultProps,
		zoomStates: zoomStates,
		zoomFocus: 3, //0 - 4,
		zoomMax: 4, //0 - 4,
		zoomMin: 0, //0 - 4,
		zoomInitial: 8, //1,2,4,8,16 or custom in like loreal-zoom-states,
		topoMap: worldMap,
		longInitial: mapOptions.longInitial,
		latInitial: mapOptions.latInitial,
		latReset: mapOptions.latReset,
		longReset: mapOptions.longReset,
		annotationsEdits: annotationEdits,
		annotationFontSizeMin: annotationOptions.fontSizeMin,
		annotationFontSizeMax: annotationOptions.fontSizeMax,
		graticuleThicknessMin: graticuleOptions.thicknessMin,
		graticuleThicknessMax: graticuleOptions.thicknessMax,
		cities: [],
		markers: [],
		annotations: [],
		markerSize: mapOptions.markerSize,
		width: mapOptions.width,
		height: mapOptions.height,
		selectedPost: undefined,
		xOffset: undefined,
		yOffset: undefined,
		scale: undefined,
		rotate: undefined,
		setMarkerRef: undefined,
		onMapDragStart: undefined,
		onMapDragEnd: undefined
	};

	componentDidMount() {
		this.resetToDefaultLocation();
	}

	handleGraticuleThinkness = () => {
		const {graticuleThicknessMin, graticuleThicknessMax, zoomStates, zoomMin, zoomMax, zoom} = this.props;
		const graticuleScale = scalePow()
			.exponent(-1)
			.domain([zoomStates[zoomMin].zoom, zoomStates[zoomMax].zoom])
			.range([graticuleThicknessMax, graticuleThicknessMin])
			.clamp(true);
		return (graticuleScale(zoom)).toFixed(3)
	};

	handleMoveStart = () => {
		this.setState({isDragging: true});
		if (!this.props.onMapDragStart) return;
		this.props.onMapDragStart();
	};

	handleMoveEnd = (newCenter) => {
		const {setMapPositionParameters, zoomStates, onMapDragEnd} = this.props;
		const centerCoords = {
			centerLong: newCenter[0],
			centerLat: newCenter[1]
		};
		this.setState({isDragging: false});
		setMapPositionParameters(false, centerCoords, zoomStates);
		if (!this.props.onMapDragStart) return;
		onMapDragEnd();
	};

	handleZoom = (direction, centerCoords) => {

		const {zoomStates, zoom, setMapPositionParameters} = this.props;
		let index = zoomStates.findIndex(item => item.zoom === zoom);

		if (direction === 'in') {
			if (index < zoomStates.length - 1) index += 1
		} else if (direction === 'out') {
			if (index > 0) index -= 1
		}
		return setMapPositionParameters(zoomStates[index].zoom, centerCoords, zoomStates);
	};

	setMarkerActive = index => index === this.props.selectedPost ? 'active' : '';

	handleAnnotationPosition = (differentiator, fontSize) => {
		const moveUp = this.props.annotationsEdits.up.indexOf(differentiator) > -1;
		const moveDown = this.props.annotationsEdits.down.indexOf(differentiator) > -1;
		if (moveUp) return -fontSize;
		if (moveDown) return fontSize;
		return 0;
	};

	hideCrowdedAnnotations = (differentiator) => {
		const hide = this.props.annotationsEdits.hide.indexOf(differentiator) > -1;
		return hide ? 'hide' : ''
	};

	handleHiddenAnnotationVisibility = differentiator => this.state.annotationActive === differentiator ? 'active' : '';

	handleAnnotationVisibility = (size, differentiator) => {
		const {zoom, zoomStates} = this.props;
		let isZoomState = zoomState => zoomState.zoom === zoom;
		const selectedZoomState = zoomStates.find(isZoomState);
		const annotationVisibilityRuleExclude = selectedZoomState.annotationVisibilityRuleExclude;
		const annotationVisibility = selectedZoomState.annotationVisibility;
		const inExclude = annotationVisibilityRuleExclude.indexOf(differentiator) > -1;
		if (size < annotationVisibility && !inExclude) return 'remove';
	};

	resetMap = () => {
		const {longReset, latReset, setMapPositionParameters, zoomStates, zoomMin} = this.props;
		const centerCoords = {
			centerLong: longReset,
			centerLat: latReset
		};
		setMapPositionParameters(zoomStates[zoomMin].zoom, centerCoords, zoomStates)
	};

	resetToCurrentLocation = () => {
		const {setMapPositionParameters, zoomStates, zoomFocus} = this.props;
		const localStorage = new LocalStorage('lexus-geo');
		const centerCoords = {
			centerLong: parseFloat(JSON.parse(localStorage.getItem('localLongitude'))),
			centerLat: parseFloat(JSON.parse(localStorage.getItem('localLatitude')))
		};

		if (centerCoords.centerLong) {
			setMapPositionParameters(zoomStates[zoomFocus].zoom, centerCoords, zoomStates)
		} else {
			this.geoFindMe()
		}
	};

	resetToDefaultLocation = () => {
		const {setMapPositionParameters, zoomStates, zoomFocus, longInitial, latInitial} = this.props;
		const centerCoords = {
			centerLong: longInitial,
			centerLat: latInitial
		};
		setMapPositionParameters(zoomStates[zoomFocus].zoom, centerCoords, zoomStates)
	};

	handleCountryClick = (differentiator) => {
		const hide = this.props.annotationsEdits.hide.indexOf(differentiator) > - 1;
		if (!hide) return;
		this.setState({activeAnnotation: differentiator})
	};

	handleCountryDblClick = (centroid) => {
		const centerCoords = {
			centerLong: centroid[0],
			centerlat: centroid[1]
		};
		this.handleZoom('in', centerCoords)
	};

	setMarkerRef = (markerRef, index) => {
		if (this.props.setMarkerRef === null) return;
		this.props.setMarkerRef(markerRef, index);
	};

	geoFindMe = () => {

		if (!navigator.geolocation) {
			console.log('geolocation is not supported by your browser');
			return;
		}

		const success = () => {
			const {setMapPositionParameters, zoomStates, zoomFocus} = this.props;
			return function(position) {
				const localStorage = new LocalStorage('lexus-geo');
				localStorage.setItem('localLongitude', JSON.stringify(position.coords.longitude));
				localStorage.setItem('localLatitude', JSON.stringify(position.coords.latitude));
				const centerCoords = {
					centerLong: position.coords.longitude,
					centerLat: position.coords.latitude
				};
				setMapPositionParameters(zoomStates[zoomFocus].zoom, centerCoords, zoomStates);
			};
		};

		const error = () => {
			console.log('unable to retrieve your location');
			this.resetMap();
		};

		return navigator.geolocation.getCurrentPosition(success, error);

	};

	render() {
		const {width, height, xOffset, yOffset, scale, rotate, topoMap, zoom, zoomFocus, zoomStates, centerLong,
			centerLat, markers, markerScale, markerSize, annotationScale, cities, annotations} = this.props;

		const projectionType = getProjection(width, height, xOffset, yOffset, scale, rotate);
		if (zoom === null) return <div/>;

		const graticuleStyle = {strokeWidth: `${this.handleGraticuleThinkness()}px`};
		const geographyStyle = {
			default: {strokeWidth: `${this.handleGraticuleThinkness()}px`},
			hover: {strokeWidth: `${this.handleGraticuleThinkness()}px`},
			pressed: {strokeWidth: `${this.handleGraticuleThinkness()}px`}
		};

		return (
			<div className='tm__wrapper'>
				<Controls rangeControls={<Range zoomStates={zoomStates} />}>
					<Zoom handleZoom={this.handleZoom} />
					<Pan zoomStates={zoomStates} />
					<Reset resetMap={this.resetMap} resetToDefaultLocation={this.resetToDefaultLocation} />
				</Controls>

				<ComposableMap
					width={width}
					height={height}
					projection={() => projectionType}
					style={{ width: '100%', height: 'auto'}}
				>
					<ZoomableGroup
						center={[centerLong, centerLat]}
						zoom={zoom}
						disablePanning={false}
						onMoveStart={this.handleMoveStart}
						onMoveEnd={this.handleMoveEnd}
						style={{ cursor: () => {if (this.state.isDragging) return 'move'}}}
					>

						<Graticule />

						<Geographies
							geography={topoMap}
							disableOptimization={false}
						>
							{(geographies, projection) => geographies.map((geography, i) => {
								const centroid = getCentroid(geography, projectionType);
								const singleClickEvent = () => this.handleCountryClick(geography.properties.cca3);
								const doubleClickEvent = () => this.handleCountryDblClick(centroid);
								return (
									<Geography
										key={i}
										cacheId={i}
										id={`country-${i}`}
										round
										geography={geography}
										projection={projection}
										onClick={getClickHandler(singleClickEvent,doubleClickEvent)}
										style={geographyStyle}
									>
									</Geography>
								)
							})}
						</Geographies>

						{markers.length > 0 &&
							<Markers>
								{
									markers.map((marker, index) =>
										<MarkerPost
											key={marker.id}
											index={index}
											marker={marker}
											setMarkerActive={this.setMarkerActive}
											setMarkerRef={this.setMarkerRef}
											markerScale={markerScale}
											markerSize={markerSize}
										/>
									)
								}
							</Markers>
						}

						{cities.length > 0 &&
							<Markers>
								{zoom >= zoomStates[zoomFocus].zoom &&
									cities.map((city, index) =>
										<MarkerCity
											key={index}
											marker={city}
											markerScale={markerScale}
											annotationScale={annotationScale}
											markerSize={markerSize}
										/>
									)
								}
							</Markers>
						}

						{annotations.length > 0 &&
							<Annotations>
								{
									annotations.map((annotation, index) =>
										<AnnotationCountry
											key={index}
											annotation={annotation}
											hideCrowdedAnnotations={this.hideCrowdedAnnotations}
											handleHiddenAnnotationVisibility={this.handleHiddenAnnotationVisibility}
											handleAnnotationVisibility={this.handleAnnotationVisibility}
											handleAnnotationPosition={this.handleAnnotationPosition}
											annotationScale={annotationScale}
										/>
									)
								}
							</Annotations>
						}

						<Graticule
							outline={false}
							round={false}
							style={graticuleStyle}
						/>

					</ZoomableGroup>
				</ComposableMap>
			</div>
		)
	}
}

const mapStateToProps = ({topoMap:{centerLat, centerLong, zoom, markerScale, annotationScale}}) => {
	return {
		centerLat,
		centerLong,
		zoom,
		markerScale,
		annotationScale
	}
};

const mapDispatchToProps = (dispatch) => {
	const dispatchedMapActions = bindActionCreators(mapActions, dispatch);
	return { setMapPositionParameters: dispatchedMapActions.setMapPositionParameters};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopoMap);
