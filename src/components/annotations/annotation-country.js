import React from 'react'
import {Annotation} from "react-simple-maps"

const AnnotationCountry = props => {
	const {
		annotation: {short, area, fontSize, splitSize, secondLang, name, centroid},
		hideCrowdedAnnotations,
		handleHiddenAnnotationVisibility,
		handleAnnotationVisibility,
		handleAnnotationPosition,
		annotationScale
	} = props;
	return (
		<Annotation {...props} subject={centroid} dx={0} dy={0} strokeWidth={0}>
			<g
				className={`rsm-annotation-text
					${hideCrowdedAnnotations(short)}
					${handleHiddenAnnotationVisibility(short)}
					${handleAnnotationVisibility(area, short)}`}
				id={`annotation-${short}`}
			>
				<text
					id={`${name}-${area}`}
					fontSize={`${fontSize}`}
					transform={ `scale(${annotationScale}) translate(0,${handleAnnotationPosition(short, fontSize)})`}>
					<tspan x={0} dy={-splitSize}>{ secondLang }</tspan>
					<tspan x={0} dy={splitSize}>{ name }</tspan>
				</text>
			</g>
		</Annotation>
	);
};

export default AnnotationCountry
