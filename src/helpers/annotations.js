import {getCentroid, getAreaInSqKm} from "./geo";
import centroidsCustom from '../config/world-centroids-custom';
import {scalePow} from 'd3-scale';

export function getFontSizeScale(paths=[], fontSizeRange, areaMaxParam) {
	const areaMax = areaMaxParam || Math.max.apply(null, paths.map((geography) => parseInt(getAreaInSqKm(geography))));
	return scalePow()
		.domain([1, areaMax])
		.range(fontSizeRange)
		.clamp(true);
}

export function prepareWorldAnnotationsInSecondLang (cca2, splitSize, secondLangAnnotations) {
	const isInSecondLang = countryInSecondLang => countryInSecondLang.cca2 === cca2;
	const countryInSecondLang = secondLangAnnotations.find(isInSecondLang);
	if (countryInSecondLang !== void 0) {
		return {
			splitSize,
			name: countryInSecondLang.name
		};
	} else {
		return {
			name: '',
			splitSize: 0
		};
	}
}

export function prepareWorldAnnotations(paths, secondLangAnnotations = [], fontSizeRange, areaMax, projectionType) {
	const fontSizeScale = getFontSizeScale(paths, fontSizeRange, areaMax);
	return paths.map((geography) => {
		const fontSize = (fontSizeScale(parseInt(getAreaInSqKm(geography)))).toFixed(3);
		const {cca2, cca3, name} = geography.properties;
		const isCustom = centroidsCustom.hasOwnProperty(cca3);
		let centroid;
		if (isCustom) {
			centroid = [centroidsCustom[cca3].centerLong, centroidsCustom[cca3].centerLat];
		} else {
			centroid = getCentroid(geography, projectionType);
		}
		const secondLang = prepareWorldAnnotationsInSecondLang(cca2, fontSize, secondLangAnnotations);

		return {
			fontSize,
			centroid,
			area: parseInt(getAreaInSqKm(geography)),
			name: name.trim(),
			secondLang: secondLang.name.trim() || '',
			short: cca3 || cca2,
			splitSize: secondLang.splitSize || 0
		};
	});
}

export function prepareProvincesAnnotations(annotations, fontSizeRange, areaMax) {
	const fontSizeScale = getFontSizeScale([], fontSizeRange, areaMax);
	return annotations.map(({lat, lng, cca2, area, name}) => {
		const fontSize = (fontSizeScale(parseInt(area))).toFixed(3);
		const isCustom = centroidsCustom.hasOwnProperty(cca2);
		let centroid;
		if (isCustom) {
			centroid = [centroidsCustom[cca2].centerLong, centroidsCustom[cca2].centerLat];
		} else {
			centroid = [lng, lat];
		}
		return {
			area,
			centroid,
			fontSize,
			name: name.trim(),
			secondLang: '',
			short: cca2,
			splitSize: 0
		};
	});
}
