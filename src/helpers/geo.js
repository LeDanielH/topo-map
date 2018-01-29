import {geoPath, geoArea} from 'd3-geo';
import {geoMiller} from 'd3-geo-projection';
import * as topojson from "topojson-client";
import {mapOptions} from '../config/world-map-options';

export function getProjection(width = mapOptions.width, height = mapOptions.height, xOffset = 0, yOffset = 0, scale = 160, rotate = [0, 0, 0], precision = 0.1) {
	return geoMiller()
		.scale(scale)
		.translate([xOffset + width / 2, yOffset + height / 2])
		.rotate(rotate)
		.precision(precision);
}

export function getCentroid(geoJsonObject, projectionType) {
	const pathForCentroids = geoPath().projection(projectionType);
	return projectionType.invert(pathForCentroids.centroid(geoJsonObject));
}

export function getAreaInSqKm(geoJsonObject) {
	const worldInSqKm = 510072000;
	const worldInStedradians = 12.56637;
	const contryAreaInSteradians = geoArea(geoJsonObject);
	return (contryAreaInSteradians / worldInStedradians * worldInSqKm).toFixed(0);
}

export function getMaxArea(paths) {
	const biggest = paths.find((biggestAnnotation) => biggestAnnotation.properties.cca3 === 'IND');
	return parseInt(getAreaInSqKm(biggest), 10);
}

export function loadGeoPaths(topoMap) {
	return topojson.feature(topoMap, topoMap.objects[Object.keys(topoMap.objects)[0]]).features;
}

function toDegreesMinutesAndSeconds(coordinate) {
	const absolute = Math.abs(coordinate);
	const degrees = Math.floor(absolute);
	const minutesNotTruncated = (absolute - degrees) * 60;
	const minutes = Math.floor(minutesNotTruncated);
	const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
	return `${degrees}°${minutes}'${seconds}`;
}

export function convertToDMS(lat, lng) {
	const latitude = toDegreesMinutesAndSeconds(lat);
	const latitudeCardinal = lat >= 0 ? 'N' : 'S';
	const longitude = toDegreesMinutesAndSeconds(lng);
	const longitudeCardinal = lng >= 0 ? 'E' : 'W';
	return `${latitude}${latitudeCardinal}+${longitude}${longitudeCardinal}`
}
