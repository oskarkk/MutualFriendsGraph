/*
var cy = cytoscape({
	container: $('#mfgPanel .graph')
});

var eles = cy.add([
	{ group: "nodes", data: { id: "n0" }, position: { x: 100, y: 100 } },
	{ group: "nodes", data: { id: "n1" }, position: { x: 200, y: 200 } },
	{ group: "edges", data: { id: "e0", source: "n0", target: "n1" } }
]);
*/

var dataArray = `[{
  "data": {
    "id": "n01",
    "name": "bezier"
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
}, {
  "data": {
    "id": "n08"
  }
}, {
  "data": {
    "id": "e06",
    "source": "n08",
    "target": "n07"
  }
}, {
  "data": {
    "id": "e07",
    "source": "n08",
    "target": "n07"
  }
}, {
  "data": {
    "id": "e08",
    "source": "n08",
    "target": "n07"
  }
}, {
  "data": {
    "id": "e09",
    "source": "n08",
    "target": "n07"
  }
}, {
  "data": {
    "id": "n09",
    "name": "segments"
  }
}, {
  "data": {
    "id": "n10"
  }
}, {
  "data": {
    "id": "e10",
    "source": "n09",
    "target": "n10"
  }
}]`;

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

	elements: JSON.parse(dataArray)
});

var testLayout = cy.layout({
  name: 'grid',
  cols: 4,
  sort: function( a, b ){
    if( a.id() < b.id() ){
      return -1;
    } else if( a.id() > b.id() ){
      return 1;
    } else {
      return 0;
    }
  }
});

var spring = cy.layout({
  name: 'cose'
});