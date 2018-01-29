import React from 'react'
import {Marker} from "react-simple-maps"

const MarkerCity = props => {
	const {marker: {name, cca3}, markerScale, markerSize, annotationScale} = props;
	return (
		<Marker {...props} preserveMarkerAspect={false}>
			<circle
				className={"rsm-marker__circle rsm-marker__city"}
				cx={0}
				cy={0}
				r={`${markerSize * 0.7}px`}
				transform={`scale(${markerScale})`}
			/>
			<circle
				className={'rsm-marker__circle rsm-marker__middle'}
				cx={0}
				cy={0}
				r={`${markerSize * 0.3}px`}
				transform={`scale(${markerScale})`}
			/>
			<g className={'rsm-marker__text'}>
				<text
					textAnchor={"middle"}
					y={"-1.5"}
					id={`city-${cca3}`}
					transform={`scale(${annotationScale})`}
				>
					<tspan x={0} dy={0}>{name}</tspan>
				</text>
			</g>
		</Marker>
	);
};

export default MarkerCity
