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

var dataArray = [`[{
  "selector": "node",
  "style": {
    "height": 40,
    "width": 40,
    "background-color": "#333",
    "label": "data(type)",
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
}, {
  "selector": "edge.bezier",
  "style": {
    "curve-style": "bezier",
    "control-point-step-size": 40
  }
}, {
  "selector": "edge.unbundled-bezier",
  "style": {
    "curve-style": "unbundled-bezier",
    "control-point-distances": 120,
    "control-point-weights": 0.1
  }
}, {
  "selector": "edge.multi-unbundled-bezier",
  "style": {
    "curve-style": "unbundled-bezier",
    "control-point-distances": [40, -40],
    "control-point-weights": [0.250, 0.75]
  }
}, {
  "selector": "edge.haystack",
  "style": {
    "curve-style": "haystack",
    "haystack-radius": 0.5
  }
}, {
  "selector": "edge.segments",
  "style": {
    "curve-style": "segments",
    "segment-distances": [ 40, -40 ],
    "segment-weights": [0.250 , 0.75]
  }
}]`, `[{
  "data": {
    "id": "n01",
    "type": "bezier"
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
  },
  "classes": "bezier"
}, {
  "data": {
    "id": "e02",
    "source": "n01",
    "target": "n02"
  },
  "classes": "bezier"
}, {
  "data": {
    "id": "e03",
    "source": "n02",
    "target": "n01"
  },
  "classes": "bezier"
}, {
  "data": {
    "id": "n03",
    "type": "unbundled-bezier"
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
  },
  "classes": "unbundled-bezier"
}, {
  "data": {
    "id": "n05",
    "type": "unbundled-bezier(multiple)"
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
  },
  "classes": "multi-unbundled-bezier"
}, {
  "data": {
    "id": "n07",
    "type": "haystack"
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
  },
  "classes": "haystack"
}, {
  "data": {
    "id": "e07",
    "source": "n08",
    "target": "n07"
  },
  "classes": "haystack"
}, {
  "data": {
    "id": "e08",
    "source": "n08",
    "target": "n07"
  },
  "classes": "haystack"
}, {
  "data": {
    "id": "e09",
    "source": "n08",
    "target": "n07"
  },
  "classes": "haystack"
}, {
  "data": {
    "id": "n09",
    "type": "segments"
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
  },
  "classes": "segments"
}]`];

var cy = window.cy = cytoscape({
	container: $('.mfgGraph'),

	boxSelectionEnabled: false,
	autounselectify: true,

	style: JSON.parse(dataArray[0]),

	elements: JSON.parse(dataArray[1])
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