(function(){
	NETWORK.GRAPH.TransformerEdges = function(svg, edgesData){	
		NETWORK.GRAPH.Edges.call(this, svg, edgesData);
		this.edges.on("mouseover", function (d) { 
			var warningData = d.validationWarning;
			var errorData = d.validationError;
			var bWarning = d.warning;
			var bError = d.error;
			var TooltipData;
			if(bError && bWarning) {
				TooltipData = NETWORK.RULES.transformerEdgeToolTipExtra.concat(errorData);
			}
			else if(bError) {
				TooltipData = NETWORK.RULES.transformerEdgeToolTipExtra.concat(errorData);
			}
			else if(bWarning) {
				TooltipData = warningData.concat(NETWORK.RULES.transformerEdgeToolTipExtra);
			}
			else {
				TooltipData = NETWORK.RULES.edgeToolTip.concat(NETWORK.RULES.transformerEdgeToolTipExtra);
			}
			NETWORK.TOOLTIP.showToolTip(d,d3.event,TooltipData);
		});
	};
	NETWORK.GRAPH.TransformerEdges.prototype = Object.create(NETWORK.GRAPH.Edges.prototype);
	NETWORK.GRAPH.TransformerEdges.prototype.consructor = NETWORK.GRAPH.TransformerEdges;	
	
	NETWORK.GRAPH.TransformerEdges.prototype.decorateEdges = function(svg, edgesData) {
		this.gCircle = svg.selectAll(".edgeCentre1").data(["1"]).enter().append("g");
		
		this.wrapperRect = this.gCircle.selectAll(".edgeCentre1").data(this.data).enter().append("rect").attr({"class":"tranformerEdgeDecoratorWrapper","height": 2*VIEWS.SharedFunctionality.R/3,
		"width": 4*VIEWS.SharedFunctionality.R/3});
		
					
		this.edgeDecoratorCircle1 = this.gCircle.selectAll(".edgeCentre1").data(this.data).enter().append("circle").attr({"class":"edgeDecorator","r": VIEWS.SharedFunctionality.R/3})
					.classed("OffStatus", function(d) { if(parseInt(d.edgeData.status) === 0) { return true; }	})
					.on("mouseover", function (d) { 
						var warningData = d.validationWarning;
						var errorData = d.validationError;
						var bWarning = d.warning;
						var bError = d.error;
						var TooltipData;
						if(bError && bWarning) {
							TooltipData = NETWORK.RULES.transformerEdgeToolTipExtra.concat(errorData);
						}
						else if(bError) {
							TooltipData = NETWORK.RULES.transformerEdgeToolTipExtra.concat(errorData);
						}
						else if(bWarning) {
							TooltipData = warningData.concat(NETWORK.RULES.transformerEdgeToolTipExtra);
						}
						else {
							TooltipData = NETWORK.RULES.edgeToolTip.concat(NETWORK.RULES.transformerEdgeToolTipExtra);
						}
						NETWORK.TOOLTIP.showToolTip(d,d3.event,TooltipData);
					})
					.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d);});
		
		this.edgeDecoratorCircle2 = this.gCircle.selectAll(".edgeCentre2").data(this.data).enter().append("circle").attr({"class":"edgeDecorator secTransEdgeDecorator","r": VIEWS.SharedFunctionality.R/3})
					.classed("OffStatus", function(d) { if(parseInt(d.edgeData.status) === 0) { return true; }	})
					.on("mouseover", function (d) { 
						var warningData = d.validationWarning;
						var errorData = d.validationError;
						var bWarning = d.warning;
						var bError = d.error;
						var TooltipData;
						
						if(bError && bWarning) {
							TooltipData = NETWORK.RULES.transformerEdgeToolTipExtra.concat(errorData);
						}
						else if(bError) {
							TooltipData = NETWORK.RULES.transformerEdgeToolTipExtra.concat(errorData);
						}
						else if(bWarning) {
							TooltipData = warningData.concat(NETWORK.RULES.transformerEdgeToolTipExtra);
						}
						else {
							TooltipData = NETWORK.RULES.edgeToolTip.concat(NETWORK.RULES.transformerEdgeToolTipExtra);
						}
						NETWORK.TOOLTIP.showToolTip(d,d3.event,TooltipData);
					})
					.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d); });
	};
	
	NETWORK.GRAPH.TransformerEdges.prototype.moveDecorator = function(){
		this.wrapperRect.each(function(d){
			var x1, y1, x2, y2;
			if(typeof d.x1 !== "undefined") {
				x1 = d.x1; x2 = d.x2; y1 = d.y1; y2 = d.y2;
			}
			else {
				x1 = d.source.x; x2 = d.target.x; y1 = d.source.y; y2 = d.target.y;
			}
				var x = (x1+x2)/2 - VIEWS.SharedFunctionality.R *.75;
				var y = (y1 +y2)/2 - VIEWS.SharedFunctionality.R * .3;
			d3.select(this).attr({"x": x,"y": y,"transform": "rotate(" + (Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI) + "," + ((x1+x2)/2) + "," + ((y1+y2)/2) +")"});
			
		});
		
		this.edgeDecoratorCircle1.each(function(d){
			var cx, cy;
			if(typeof d.x1 !== "undefined") {
				cx = (d.x1 + d.x2)/2;
				cy = (d.y1 + d.y2)/2;
			}
			else {
				cx = (d.source.x + d.target.x)/2;
				cy = (d.source.y +d.target.y)/2;
			}
			d3.select(this).attr({"cx": cx,"cy": cy}); 
		});
		
		this.edgeDecoratorCircle2.each(function(d){
			var x1, y1, x2, y2;
			if(typeof d.x1 !== "undefined") {
				x1 = d.x1; x2 = d.x2; y1 = d.y1; y2 = d.y2;
			}
			else {
				x1 = d.source.x; x2 = d.target.x; y1 = d.source.y; y2 = d.target.y;
			}
			var xlen = (x2 - x1), ylen = (y2 - y1);
			var hlen = Math.sqrt(Math.pow(xlen,2) + Math.pow(ylen,2));
			var smallerLen = (VIEWS.SharedFunctionality.R/3 + hlen/2);
			var ratio = smallerLen / hlen;
			var smallerXLen = xlen * ratio;
			var smallerYLen = ylen * ratio;
			var smallerX = (x1 + smallerXLen), smallerY = y1 + smallerYLen;	
			d3.select(this).attr({"cx": smallerX,"cy": smallerY});
		});
	};	
})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));