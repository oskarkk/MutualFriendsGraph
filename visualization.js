var testNodes = [
	{
	data: {
		id: "n01",
		name: "bezier"
	}
	}, {
		"data": {
			"id": "n02"
		}
	}, {
		"data": {
			"id": "e01",
			"source": "n01",
			"target": "n02"
		}
	}, {
		"data": {
			"id": "e02",
			"source": "n01",
			"target": "n02"
		}
	}, {
		"data": {
			"id": "e03",
			"source": "n02",
			"target": "n01"
		}
	}, {
		"data": {
			"id": "n03",
			"name": "unbundled-bezier"
		}
	}, {
		"data": {
			"id": "n04"
		}
	}, {
		"data": {
			"id": "e04",
			"source": "n03",
			"target": "n04"
		}
	}, {
		"data": {
			"id": "n05",
			"name": "unbundled-bezier(multiple)"
		}
	}, {
		"data": {
			"id": "n06"
		}
	}, {
		"data": {
			"id": "e05",
			"source": "n05",
			"target": "n06"
		}
	}, {
		"data": {
			"id": "n07",
			"name": "haystack"
		}
	}
];

var cy = window.cy = cytoscape({
	container: $('.mfgGraph'),

	boxSelectionEnabled: false,
	autounselectify: true,

	style: [{
		"selector": "node",
		"style": {
			"height": 40,
			"width": 40,
			"background-color": "#333",
			"label": "data(name)",
			"text-valign": "center",
			"text-halign": "left"
		}
	}, {
		"selector": "edge",
		"style": {
			"width": 3,
			"opacity": 0.666,
			"line-color": "#888"
		}
	}],

	elements: testNodes
});

var layout = {
	grid: {
		name: 'grid',
		cols: 4
	},
	cose: {
		name: 'cose',
		idealEdgeLength: 100,
		nodeOverlap: 20,
		refresh: 20,
		fit: true,
		padding: 30,
		randomize: true,
		componentSpacing: 100,
		nodeRepulsion: 400000,
		edgeElasticity: 100,
		nestingFactor: 5,
		gravity: 80,
		numIter: 1000,
		initialTemp: 200,
		coolingFactor: 0.95,
		minTemp: 1.0
	}
};