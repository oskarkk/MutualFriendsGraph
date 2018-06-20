function startGraph(cont) {
	cy = window.cy = cytoscape({
		container: $(cont),
	
		boxSelectionEnabled: false,
		autounselectify: true,
		wheelSensitivity: 0.15,
	
		style: null,
		elements: null
	});
}

var graphLayout = {
	grid: {
		name: 'grid',
		cols: 20,
		spacingFactor: 1.5
	},
	cose: {
		name: 'cose',
		
		animate: true,
		animationThreshold: 250,
		refresh: 20,
		
		randomize: true,

		idealEdgeLength: 100,
		nodeOverlap: 20,
		fit: true,
		padding: 30,
		componentSpacing: 100,
		nodeRepulsion: 400000,
		edgeElasticity: 100,
		nestingFactor: 5,
		gravity: 80,
		numIter: 1000,
		initialTemp: 200,
		coolingFactor: 0.95,
		minTemp: 1.0
	},
	current: {}
};

var graphStyle = [{
	selector: "node",
	style: {
		"height": 40,
		"width": 40,
		"background-color": "#333",
		"label": "data(name)",
		"text-valign": "center",
		"text-halign": "center",
		"text-wrap": "none",
		"min-zoomed-font-size": "5px"
	}
}, {
	selector: "edge",
	style: {
		"width": 3,
		"opacity": 0.666,
		"line-color": "#888"
	}
}];

graphLayout.current = Object.assign({}, graphLayout.cose);