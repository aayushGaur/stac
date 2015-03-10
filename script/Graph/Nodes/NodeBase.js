(function(){
	/**
	*	The base Class implementation for Nodes - Constructor with the following parameters.
	*	@param	svg 				The SVG node in which the link is to appended
	*	@param	linksData		Data for the links that need to be generated between the given nodes.
	**/
	NETWORK.GRAPH.Nodes = function(data,svg, cola){
		this.data = data;
		this.svg = svg;
		this.nodesGroupTag = this.svg.selectAll(".busGroupIcon").data(data).enter().append("g").attr({"fill": "white","nodeType":function (d) { return d.nodeType; }})
													.on("mousedown", function () { VIEWS.SharedFunctionality.nodeMouseDown = true; }) // recording the mousedown state allows us to differentiate dragging from panning
													.on("mouseup", function () { VIEWS.SharedFunctionality.nodeMouseDown = false; })
													//.on("dblclick", function (d) {
													//	d.fixed |= 16;
													//	d3.select(this).selectAll(".node").attr({"style": "fill:red"});
													//})
													.call(cola.drag);
													
		
		this.labels = this.getNodeLabels(cola);
		
		this.bottomDecorators = new NETWORK.GRAPH.Nodes.BottomDecorators(this.nodesGroupTag);
		this.bottomDecorators.decorate();
		
		this.topDecorators = new NETWORK.GRAPH.Nodes.TopDecorators(this.nodesGroupTag);
		this.topDecorators.decorate();
		
		this.centerUI = this.getNodeCenterUI(this.nodesGroupTag);
	};
	
	NETWORK.GRAPH.Nodes.prototype.getNodeLabels = function(cola) {
		 return (this.svg.selectAll(".label").data(this.data).enter().append("text").attr("class", "label nodeLabel")
			.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
			.text(function (d) { return d.bus_i; })
			.on("mouseover", function (d) { 
														if(d.error) {
																NETWORK.TOOLTIP.showToolTip(d,d3.event,d.validationError);
															}
															else {
																NETWORK.TOOLTIP.showToolTip(d,d3.event,NETWORK.RULES.nodeToolTip);
															}
														})
			.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d); })
			.call(cola.drag));
	};
	
	NETWORK.GRAPH.Nodes.prototype.getNodeCenterUI = function(nodesGroupTag) {
		 (nodesGroupTag.append("circle").attr("class", "node busIcon")
														.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
														.attr("id",function (d) { d["DOMID"] = ("bus" + d.bus_i); return d.DOMID ; })
														.attr("r", VIEWS.SharedFunctionality.R)
														.on("mouseover", function (d) { 
															if(d.error) {
																NETWORK.TOOLTIP.showToolTip(d,d3.event,d.validationError);
															}
															else {
																NETWORK.TOOLTIP.showToolTip(d,d3.event,NETWORK.RULES.nodeToolTip);
															}
														})
														.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d); }));
	};
	
	NETWORK.GRAPH.Nodes.prototype.tick = function () {		
		this.nodesGroupTag.selectAll(".node").each(function (d) {
			d3.select(this).attr({ "cx" : d.x, "cy": d.y, "zoomPointX": d.x, "zoomPointY" : d.y });
		});
		
		this.labels.attr("x", function (d) { return d.x; })
			 .attr("y", function (d) {
				 var h = this.getBBox().height;
				 return d.y + h/4 + 1 ;
		});
		
		this.topDecorators.tick();
		this.bottomDecorators.tick();
	};	
})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));