export default [
	{
		zoom: 1,
		boundaries: {
			longMax: 5,
			longMin: -4,
			latMax: 22,
			latMin: -22
		},
		annotationScale: 1.4,
		markerScale: 2,
		annotationVisibility: 100000000,
		annotationVisibilityRuleExclude: []
	}, {
		zoom: 2,
		boundaries: {
			longMax: 93,
			longMin: -93,
			latMax: 66,
			latMin: -66
		},
		annotationScale: 1.3,
		markerScale: 1.5,
		annotationVisibility: 460000,
		annotationVisibilityRuleExclude: ['GBR', 'SWE', 'ROU', 'DEU', 'ITA', 'IRQ', 'PRY', 'FIN', 'NOR', 'POL', 'JPN', 'CIV', 'NZL', 'PHL']
	}, {
		zoom: 4,
		boundaries: {
			longMax: 136,
			longMin: -136,
			latMax: 80,
			latMin: -80
		},
		annotationScale: 1,
		markerScale: 1,
		annotationVisibility: 100000,
		annotationVisibilityRuleExclude: ['KOR', 'DOM', 'AUT', 'CHE', 'SRB', 'HRV', 'DNK', 'KGZ', 'HUN', 'CZE', 'IRL', 'PRT', 'LKA']
	}, {
		zoom: 6,
		boundaries: {
			longMax: 147,
			longMin: -147,
			latMax: 82,
			latMin: -82
		},
		annotationScale: 0.85,
		markerScale: 0.85,
		annotationVisibility: 100000,
		annotationVisibilityRuleExclude: ['KOR', 'DOM', 'AUT', 'CHE', 'SRB', 'HRV', 'DNK', 'KGZ', 'HUN', 'CZE', 'IRL', 'PRT', 'LKA', 'IN']
	}, {
		zoom: 8,
		boundaries: {
			longMax: 158,
			longMin: -158,
			latMax: 85,
			latMin: -85
		},
		annotationScale: 0.7,
		markerScale: 0.7,
		annotationVisibility: 10000,
		annotationVisibilityRuleExclude: ['BHR']
	}, {
		zoom: 16,
		boundaries: {
			longMax: 169,
			longMin: -169,
			latMax: 87,
			latMin: -87
		},
		annotationScale: 0.5,
		markerScale: 0.5,
		annotationVisibility: 1,
		annotationVisibilityRuleExclude: []
	}
];
