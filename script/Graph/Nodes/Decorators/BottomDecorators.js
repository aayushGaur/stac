(function(){

	NETWORK.GRAPH.Nodes.BottomDecorators = function(nodesGroupTag){
		this.nodesGroupTag = nodesGroupTag;
	};
	
	NETWORK.GRAPH.Nodes.BottomDecorators.prototype.decorate = function() {
		var R = VIEWS.SharedFunctionality.R;
		var LL = (R/2);
		this.nodesGroupTag.each(function(d){
			var bottomDecCount = d.bottomDecorators.length;
				if( bottomDecCount !== 0 ) {
				var bottomDecGroup = d3.select(this).append("g").attr("class","bottomDecoratorGroup").attr("id", function (d) { return d.bottomDecorators.DOMID;})
															.on("mouseout", function (d) { NETWORK.TOOLTIP.hideToolTip(d); });
				
				//Adding vertical central connector
					bottomDecGroup.append("line").attr("id",function (d) { return ("bus" + d.bus_i+"btmDeco"); })
																	.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																	.attr({"class":"decorators","x1": 0,"x2": 0,"y2": -(R+(LL*2))})
																	.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																	.attr ("y1", function (d) { 
																									if(bottomDecCount > 1){ return -(R + LL); }
																									else { return -R }; });
														
				//Adding horizontal central connector for multiple bottom decorators.
					if(bottomDecCount > 1) {
						bottomDecGroup.append("line").attr({"class":"decorators","x1": -R/2,"x2": R/2,"y1": -(R  + LL),"y2": -(R + LL)})
																	  .classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; } });
																	  
							for(var index = 0; index < bottomDecCount; index++) {
								if(d.bottomDecorators[index].type === "load") {
								var busBottomArrowHeads = bottomDecGroup.append("svg:defs").append("svg:marker").attr("id", function(d) { return ("ArrowBottom" + d.bus_i); })
																				.on("mouseover", function (d) { 
																					var toolTipData = NETWORK.RULES.bottomDecoToolTipLoad;
																					for(var index = 0; index < d.bottomDecorators.length;index++) {
																						var data = d.bottomDecorators[index].validationWarning;
																						if(d.bottomDecorators[index].warning) {
																							toolTipData = data;
																								break;
																							}
																						}
																					NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																				})
																				.attr({"viewBox":"-6 -6 12 12","refX": (1.75 * R),"refY": 0,"markerWidth": 5,"markerHeight": 5,"markerUnits": "strokeWidth","orient": "auto","class":"loadMarker",})
																				.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																				.append("svg:polygon").attr({"points":"2,0 5,-5 -5,0 5,5","class":"loadPolygon"})
																					.classed("OffStatusLoadPolygon", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																					.on("mouseover", function (d) { 
																						var toolTipData = NETWORK.RULES.bottomDecoToolTipLoad;
																						for(var index = 0; index < d.bottomDecorators.length;index++) {
																							var data = d.bottomDecorators[index].validationWarning;
																							if(d.bottomDecorators[index].warning) {
																								toolTipData = data;
																									break;
																								}
																							}
																						NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																					});
									
									bottomDecGroup.append("line").on("mouseover", function (d) { 
										var toolTipData = NETWORK.RULES.bottomDecoToolTipLoad;
										for(var index = 0; index < d.bottomDecorators.length;index++) {
											var data = d.bottomDecorators[index].validationWarning;
											if(d.bottomDecorators[index].warning) {
												toolTipData = data;
													break;
												}
											}
										NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
									})
										.attr("id",function (d) { return ("bus" + d.bus_i+"btmDeco" + index); })
										.attr({"class":"decorators loadDecorator","x1":  (-R/2),"x2":  (-R/2),"y1": (-R/2),"y2": (-1.5*R),"marker-end":"url(#ArrowBottom" + d.bus_i+")"})
										.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	});
								}
								else if (d.bottomDecorators[index].type === "shunt") {
									bottomDecGroup.append("line").on("mouseover", function (d){ 
																						var toolTipData = NETWORK.RULES.bottomDecoToolTipShunt;
																						for(var index = 0; index < d.bottomDecorators.length;index++) {
																							var data = d.bottomDecorators[index].validationWarning;
																							if(d.bottomDecorators[index].warning) {
																								toolTipData = data;
																									break;
																								}
																							}
																						NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																					})
																					.attr({"class":"decorators shuntDecorator","x1":  R/2,"x2":  R/2,"y1": -R/2,"y2": -1.5*R})
																					.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	});
																					
									bottomDecGroup.append("line").on("mouseover", function (d){ 
																						var toolTipData = NETWORK.RULES.bottomDecoToolTipShunt;
																						for(var index = 0; index < d.bottomDecorators.length;index++) {
																							var data = d.bottomDecorators[index].validationWarning;
																							if(d.bottomDecorators[index].warning) {
																								toolTipData = data;
																									break;
																								}
																							}
																						NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																					})
																				  .attr({"class":"decorators shuntDecorator","x1": 0,"x2":R,"y1": -R/2,"y2": -R/2})
																				  .classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	});
																				
									bottomDecGroup.append("line").on("mouseover", function (d){
																						var toolTipData = NETWORK.RULES.bottomDecoToolTipShunt;
																						for(var index = 0; index < d.bottomDecorators.length;index++) {
																							var data = d.bottomDecorators[index].validationWarning;
																							if(d.bottomDecorators[index].warning) {
																								toolTipData = data;
																									break;
																								}
																							}
																						NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																					})
																				  .attr({"class":"decorators shuntDecorator","x1": R/4,"x2": .75*R,"y1": -(R/2 - LL/2),"y2": -(R/2 - LL/2)})
																				  .classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	});
								}
							}					
					}				
					else {	
							if(d.bottomDecorators[0].type === "load") {
								var busBottomArrowHeads = bottomDecGroup.append("svg:marker").attr("id", function(d) { return ("ArrowBottom" + d.bus_i); })
																			.on("mouseover", function (d) { var toolTipData = NETWORK.RULES.bottomDecoToolTipLoad;
																								for(var index = 0; index < d.bottomDecorators.length;index++) {
																									var data = d.bottomDecorators[index].validationWarning;
																									if(d.bottomDecorators[index].warning) {
																										toolTipData = data;
																										break;
																									}
																								}
																								NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																			})
																			.attr({"viewBox":"-6 -6 12 12","refX": (1.75*R),"refY": 0,"markerWidth": 5,"markerHeight": 5,"markerUnits": "strokeWidth","orient": "auto","class":"loadMarker",})
																				.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																				.append("svg:polygon").attr({"points":"2,0 5,-5 -5,0 5,5","class":"loadPolygon"})
																					.classed("OffStatusLoadPolygon", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																					.on("mouseover", function (d) { var toolTipData = NETWORK.RULES.bottomDecoToolTipLoad;
																								for(var index = 0; index < d.bottomDecorators.length;index++) {
																									var data = d.bottomDecorators[index].validationWarning;
																									if(d.bottomDecorators[index].warning) {
																										toolTipData = data;
																										break;
																									}
																								}
																								NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																						});
								
								d3.select("#bus" + d.bus_i+"btmDeco").on("mouseover", function (d) {
																								var toolTipData = NETWORK.RULES.bottomDecoToolTipLoad;
																								for(var index = 0; index < d.bottomDecorators.length;index++) {
																									var data = d.bottomDecorators[index].validationWarning;
																									if(d.bottomDecorators[index].warning) {
																										toolTipData = data;
																										break;
																									}
																								}
																								NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
																						})
																						.attr("marker-end","url(#ArrowBottom" + d.bus_i+")")
																						.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																						.attr("class","decorators loadDecorator");
							}
							else if (d.bottomDecorators[0].type === "shunt") {
								bottomDecGroup.on("mouseover", function (d) { 
																								var toolTipData = NETWORK.RULES.bottomDecoToolTipShunt; 
																								for(var index = 0; index < d.bottomDecorators.length;index++) {
																									var data = d.bottomDecorators[index].validationWarning;
																									if(d.bottomDecorators[index].warning) {
																										toolTipData = data;
																										break;
																									}
																								}
																								NETWORK.TOOLTIP.showToolTip(d,d3.event,toolTipData);
															})
															.append("line").attr({"class":"decorators","x1": -R/2,"x2": R/2,"y1": -R,"y2": -R})
																.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	});
														
								bottomDecGroup.append("line").attr({"class":"decorators","x1": -R/4,"x2": R/4,"y1": -(R - LL/2),"y2": -(R - LL/2)})
																			.classed("OffStatus", function(d) { if(parseInt(d.status) === 0) { return true; }	})
																			.attr("class","decorators shuntDecorator");
							}
						}
			}
		});
	}; 

	NETWORK.GRAPH.Nodes.BottomDecorators.prototype.tick = function() {
		d3.selectAll(".bottomDecoratorGroup").attr ("transform", function (d) { return ("translate(" + d.x + "," + (d.y + (3 *  VIEWS.SharedFunctionality.R)) +")") ; })
																.attr("zoomPointX", function (d) {return d.x})
																.attr("zoomPointY" , function (d) {return d.y});
	};
})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));