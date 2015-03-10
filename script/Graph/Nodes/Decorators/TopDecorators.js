(function(){
	/**
	*	The base Class implementation for edges - Constructor with the following parameters.
	*	@param	svg 				The SVG node in which the link is to appended
	*	@param	linksData		Data for the links that need to be generated between the given nodes.
	**/
	NETWORK.GRAPH.Nodes.TopDecorators = function(nodesGroupTag){
		this.nodesGroupTag = nodesGroupTag;
	};
	
	NETWORK.GRAPH.Nodes.TopDecorators.prototype.decorate = function(svg) {
		var busTopDecoration = this.nodesGroupTag.each(function(d){ 
			var topDecoCount = d.topDecorators.length;
			var R = VIEWS.SharedFunctionality.R
			var LL = (R/2);
			
			if(topDecoCount !== 0 ) {
				var topDecoratorGroup = d3.select(this).append("g").attr("class","topDecoratorGroup")
																			.attr("id", function (d) { return d.topDecorators.DOMID; });
														
				for(var index = 0; index < topDecoCount; index++) {
						topDecoratorGroup.append("circle")
							.attr("class","topDecoCircle")
							//Checking and adding OffStatus
							.classed("OffStatus", function(d) { if((parseInt(d.topDecorators[index].topDecoData.status) === 0) || (parseInt(d.status) === 0)) { return true; }	})
							.attr("index",index)
							.attr("id", function (d) { return ("bus" + d.bus_i + "topDeco" + index);})
							.attr("r", (R/2))
							.attr("cy", (-(1.5 * R + (2 * LL))))
							.attr("cx", function (d) {
																if(topDecoCount % 2 === 0) {
																	//Factor to be added to the topDecoCount to adjust the position of the top decorators.
																	var x = ((topDecoCount - 4)/2 + 0.5);
																	return ((-(topDecoCount + x) + (3 * index)) * (R/2));
																}
																else
																	return (((-(3 * (topDecoCount  - 1))/2) + (3 * index)) * ( R/2));
														})
							.on("mouseover", function (d) { 
								var index = this.attributes.index.value;
								var topDeco = d.topDecorators[index];
								var warningData = topDeco.validationWarning;
								var errorData = topDeco.validationError;
								var bWarning = topDeco.warning;
								var bError = topDeco.error;
						
								if(bError && bWarning) {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,errorData);
								}
								else if(bError) {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,errorData);
								}
								else if(bWarning) {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,warningData);
								}
								else {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,NETWORK.RULES.topDecoToolTip);
								}
							})
							.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d); });
							
							//Adding the tilde to the top decorator.
						topDecoratorGroup.append("text")
							.attr("dy", function (d) { 
								if(d.topDecorators[index].text === "~") {
									return (parseInt($("#bus" + d.bus_i + "topDeco" + index).attr("cy")) + 2.5); 
								}
								else {
									return (parseInt($("#bus" + d.bus_i + "topDeco" + index).attr("cy")) + 2); 
								}
							})
							.attr("dx", function (d) { return ($("#bus" + d.bus_i + "topDeco" + index).attr("cx") - 2.6); })
							.attr("class","labelText topDecoratorText")
							//Checking and adding OffStatus
							.classed("OffStatus", function(d) { if((parseInt(d.topDecorators[index].topDecoData.status) === 0) || (parseInt(d.status) === 0)) { return true; }	})
								//This class has been added to set the fill of the text in the top deocrator as grey.
							.classed("OffStatusTopDecoLabel", function(d) { if((parseInt(d.topDecorators[index].topDecoData.status) === 0) || (parseInt(d.status) === 0)) { return true; }	})
							.text(function (d) { return d.topDecorators[index].text })
							.attr("index",index)
							.on("mouseover", function (d) {
								var index = this.attributes.index.value;
								var topDeco = d.topDecorators[index];
								var warningData = topDeco.validationWarning;
								var errorData = topDeco.validationError;
								var bWarning = topDeco.warning;
								var bError = topDeco.error;
						
								if(bError && bWarning) {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,errorData);
								}
								else if(bError) {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,errorData);
								}
								else if(bWarning) {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,warningData);
								}
								else {
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index].topDecoData,d3.event,NETWORK.RULES.topDecoToolTip);
								}
							})
							.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d); });							
	
				//Adding connecting lines (vertical lines) for multiple top decorators.		
					if(topDecoCount > 1) {
							topDecoratorGroup.append("line")
								.attr("class","decorators")
								.attr ("x1", function (d) { return $("#bus" + d.bus_i + "topDeco" + index).attr("cx"); })
								.attr ("x2", function (d) { return $("#bus" + d.bus_i + "topDeco" + index).attr("cx"); })
								.attr ("y1", -(R + LL))
								.attr ("y2", -(R + (LL * 2)))
								.attr("dx", function (d) { return ($("#bus" + d.bus_i + "topDeco" + index).attr("cx") - 4); });
						}
				}
				
				//Adding horizontal central connector for multiple top decorators.
				if(topDecoCount > 1) {
					topDecoratorGroup.append("line")
						.attr("class","decorators")
						.attr ("x1", function (d) { return $("#bus" + d.bus_i + "topDeco0").attr("cx"); })
						.attr ("x2", function (d) { return $("#bus" + d.bus_i + "topDeco" + (topDecoCount-1)).attr("cx"); })
						.attr ("y1", -(R + LL))
						.attr ("y2", -(R + LL));
				}
				
				//Adding vertical central connector and its OffStatus.
				topDecoratorGroup.append("line").attr({"class":"decorators","x1": 0,"x2":0,"y1": -R})
							.attr ("y2", function () { if(topDecoCount > 1)
											return (-(R + LL));
										else
											return (-(R + (LL * 2)));
								})
								.classed("OffStatus", function(d) { 
									var bRet= false;
									if(parseInt(d.status) === 0) {
										bRet =  true;
									}
									else if(topDecoCount === 1)
									{
										if (parseInt(d.topDecorators[0].topDecoData.status) === 0) {
											bRet =  true;
										}
									}
									return bRet;
								});									
			}
		});
	};

	NETWORK.GRAPH.Nodes.TopDecorators.prototype.tick = function() {
		d3.selectAll(".topDecoratorGroup").attr ("transform", function (d) { return ("translate(" + d.x + "," + d.y +")"); })
														 .attr("zoomPointX", function (d) {return d.x})
														 .attr("zoomPointY" , function (d) {return d.y});
	};
})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));