(function(){
	NETWORK.GRAPH.StandardEdges = function(svg, edgesData){ NETWORK.GRAPH.Edges.call(this, svg, edgesData);};
	NETWORK.GRAPH.StandardEdges.prototype = Object.create(NETWORK.GRAPH.Edges.prototype);
	NETWORK.GRAPH.StandardEdges.prototype.consructor = NETWORK.GRAPH.StandardEdges;	
})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));