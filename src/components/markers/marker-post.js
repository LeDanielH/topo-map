import React from 'react'
import {Marker} from "react-simple-maps"

const MarkerPost = props => {
	const {
		marker: {
			onMouseEnter,
			polygonPoints,
			onMouseLeave,
			id,
			shape,
			customClass,
			onClick,
			coordinates,
			contentData:{title, text, image}
		}, setMarkerRef, markerScale, markerSize, setMarkerActive, index} = props;

	return (
		<Marker {...props} preserveMarkerAspect={false}>
			<g
				className={`rsm-marker__wrapper ${setMarkerActive(index)}`}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onClick={onClick}
				ref={(markerRef) => setMarkerRef(markerRef, index)}
				transform={`scale(${markerScale})`}
				data-index={index}
				data-title={title}
				data-content={text}
				data-image={image}
				data-lng={coordinates[0]}
				data-lat={coordinates[1]}
				id={`rsm-marker__wrapper-${id}`}
			>

				{shape === 'circle' &&
					<circle
						className={`rsm-marker__${shape} rsm-marker__${customClass}`}
						cx={0}
						cy={0}
						r={`${markerSize}px`}
					/>}

				{shape === 'polygon' &&
					<polygon
						className={`rsm-marker__${shape} rsm-marker__${customClass}`}
						points={polygonPoints}
					/>}

				{shape === 'rectangle' &&
					<rect
						className={`rsm-marker__${shape} rsm-marker__${customClass}`}
						x={0}
						y={0}
						width={markerSize * 2}
						height={markerSize * 2}
					/>}
			</g>
		</Marker>
	);
};

export default MarkerPost
