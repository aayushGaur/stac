(function(){
	/**
	*	The base Class implementation for edges - Constructor with the following parameters.
	*	@param	svg 				The SVG node in which the link is to appended
	*	@param	linksData		Data for the links that need to be generated between the given nodes.
	**/
	NETWORK.GRAPH.Edges = function(svg, edgesData){
		this.data = edgesData;
		this.edges = svg.selectAll(".edges").data(this.data).enter().append("line").attr("class", "edge")
								.attr("id", function(d) {	d.edgeData["DOMID"] = ("edge" + d.index); return d.edgeData.DOMID;})
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
		this.decorateEdges(svg);
	};
	
	NETWORK.GRAPH.Edges.prototype.decorateEdges = function(svg) {
		this.edgeDecorator = svg.selectAll(".edgeCentre").data(this.data).enter().append("rect").attr({"class":"edgeDecorator","x": 0,"y": 0, "height": VIEWS.SharedFunctionality.R/2,"width": VIEWS.SharedFunctionality.R})
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
	
	NETWORK.GRAPH.Edges.prototype.tick = function(){
		this.moveEdges();
		this.moveDecorator();		
	};
	
	NETWORK.GRAPH.Edges.prototype.moveEdges = function(){
		
		this.edges.each(function (d) {d3.select(this).attr({"x1": d.source.x, "y1": d.source.y, "x2": d.target.x, "y2": d.target.y }); });
		
		this.edges.each(function (d) {d3.select(this).attr({"zoomPointX": (d.source.x + d.target.x)/2, "zoomPointY" : (d.source.y + d.target.y)/2 }); });
	};
	
	NETWORK.GRAPH.Edges.prototype.moveDecorator = function(){
		this.edgeDecorator.each(function(d){
				//The custom values of the attributes x1,x2, y1 and y2 in the 'd' object are set in the multiLineEdge. 
				//These are honoured first so as to keep the functionality of moving the edge decorators at one place itself....same is the case with transformer edges.
				var x1, y1, x2, y2;
				if(typeof d.x1 !== "undefined") {
					x1 = d.x1; x2 = d.x2; y1 = d.y1; y2 = d.y2;
					d3.select(this).attr ({"x": ((x1 + x2)/2 - VIEWS.SharedFunctionality.R/2),"y":((y1 + y2)/2 - VIEWS.SharedFunctionality.R/4),
					"transform": "rotate(" + (Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI) + "," + ((x1+x2)/2) + "," + ((y1+y2)/2) +")"
					});
				}
				else {
					x1 = d.source.x; x2 = d.target.x; y1 = d.source.y; y2 = d.target.y;
					d3.select(this).attr ({"x": ((x1 + x2)/2 - VIEWS.SharedFunctionality.R/2),"y":((y1 + y2)/2 - VIEWS.SharedFunctionality.R/4),
						"transform": "rotate(" + (Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI) + "," + ((x1+x2)/2) + "," + ((y1+y2)/2) +")"});
				}
			});
		};

})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));