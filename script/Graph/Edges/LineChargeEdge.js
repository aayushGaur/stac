(function(){
	NETWORK.GRAPH.LineChargeEdges = function(svg, edgesData){ NETWORK.GRAPH.Edges.call(this, svg, edgesData);};
	NETWORK.GRAPH.LineChargeEdges.prototype = Object.create(NETWORK.GRAPH.Edges.prototype);
	NETWORK.GRAPH.LineChargeEdges.prototype.consructor = NETWORK.GRAPH.LineChargeEdges;	
	
	NETWORK.GRAPH.LineChargeEdges.prototype.decorateEdges = function(svg, edgesData) {
		var gradient = svg.append("svg:defs").append("svg:linearGradient").attr({"x1":"0%","y1":"0%","x2":"100%","y2":"0%","spreadMethod":"pad"})
		.attr("id",function() {
			if (svg.attr("id") === "svgGraph") {
				return "LineChargeGradient";
			}
			else {
				return "LineChargeGradientHelp";
			}
		});
		gradient.append("svg:stop").attr({"offset":"20%","stop-color":"black","stop-opacity":1});
		gradient.append("svg:stop").attr({"offset": "20%","stop-color": "white","stop-opacity": 1});
		gradient.append("svg:stop").attr({"offset":"80%","stop-color":"white","stop-opacity":1});
		gradient.append("svg:stop").attr({"offset":"80%","stop-color":"black","stop-opacity":1});
		
		
		var offGradient = svg.append("svg:defs").append("svg:linearGradient").attr({"id": "LineChargeGradientOffStatus","x1":"0%","y1":"0%","x2":"100%","y2":"0%","spreadMethod":"pad"});
		offGradient.append("svg:stop").attr({"offset":"20%","stop-color":"grey","stop-opacity":1});
		offGradient.append("svg:stop").attr({"offset": "20%","stop-color": "white","stop-opacity": 1});
		offGradient.append("svg:stop").attr({"offset":"80%","stop-color":"white","stop-opacity":1});
		offGradient.append("svg:stop").attr({"offset":"80%","stop-color":"grey","stop-opacity":1});
				
		this.edgeDecorator = svg.selectAll(".edgeCentre")
							.data(this.data).enter()
							.append("rect").attr({"class":"edgeDecorator lineChargeEdges","x":0,"y":0,"height": VIEWS.SharedFunctionality.R/2,"width": VIEWS.SharedFunctionality.R})
								.style("fill", function(d) { if(parseInt(d.edgeData.status) === 0) { return "url(#LineChargeGradientOffStatus)"; } else { 
										if (svg.attr("id") === "svgGraph") {
											return "url(#LineChargeGradient)";
										}
										else {
											return "url(#LineChargeGradientHelp)";
										}
									}
								})
								.classed("OffStatus", function(d) { if(parseInt(d.edgeData.status) === 0) { return true; }	})
								.on("mouseover", function (d) { 
									var warningData = d.validationWarning;
									var errorData = d.validationError;
									var bWarning = d.warning;
									var bError = d.error;
									var TooltipData;
									if(bError && bWarning) {
										TooltipData = errorData;
									}
									else if(bError) {
										TooltipData = errorData;
									}
									else if(bWarning) {
										TooltipData = warningData;
									}
									else {
										TooltipData = NETWORK.RULES.edgeToolTip; 
									}
									NETWORK.TOOLTIP.showToolTip(d,d3.event,TooltipData);
								})
								.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d); });
	};
})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));