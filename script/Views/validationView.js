//The Validation View has been implemented with a static functionality because it is only used to update of the UI of the network and an object of the same is not required.
VIEWS.ValidationView  = (function(){
	return {
		performValidation : function() {
			//Gradient for lineCharge Edges - Warning view
			var warningGradient = d3.select("defs").append("svg:linearGradient").attr({'id':'LineChargeGradientWarning','x1':'0%','y1':'0%','x2':'100%','y2':'0%','spreadMethod':'pad'});
			warningGradient.append("svg:stop").attr({'offset': '20%','stop-color':'orange','stop-opacity': 1});
			warningGradient.append("svg:stop").attr({'offset': '20%','stop-color':'white','stop-opacity': 1});
			warningGradient.append("svg:stop").attr({'offset': '80%','stop-color':'white','stop-opacity': 1});
			warningGradient.append("svg:stop").attr({'offset': '80%','stop-color':'orange','stop-opacity': 1});
			
			//Gradient for lineCharge Edges - Error view
			var errorGradient = d3.select("defs").append("svg:linearGradient").attr({'id':'LineChargeGradientError','x1':'0%','y1':'0%','x2':'100%','y2':'0%','spreadMethod':'pad'});
			errorGradient.append("svg:stop").attr({'offset': '20%','stop-color':'red','stop-opacity': 1});
			errorGradient.append("svg:stop").attr({'offset': '20%','stop-color':'white','stop-opacity': 1});
			errorGradient.append("svg:stop").attr({'offset': '80%','stop-color':'white','stop-opacity': 1});
			errorGradient.append("svg:stop").attr({'offset': '80%','stop-color':'red','stop-opacity': 1});
			
			//Alternate Color on the elements.
			var crtClass = "error";
			var crtDecoID = "LineChargeGradientError";
			setInterval(function() {
				d3.selectAll(".errorWarning").classed(crtClass, false);
				crtClass = crtClass === 'error' ? 'warning' : 'error';
				d3.selectAll(".errorWarning").classed(crtClass, true);
			//Added to alternate the color of the Line Charge Decorator.
				d3.selectAll(".LineChargeDecoErrorWarning").style("fill", "url(#"+crtDecoID +")");
				crtDecoID = crtDecoID === 'LineChargeGradientError' ? 'LineChargeGradientWarning' : 'LineChargeGradientError';
				d3.selectAll(".LineChargeDecoErrorWarning").style("fill", "url(#"+crtDecoID +")");
			}, 1000);
				
			//Update the UI of the edges based on the errors and warnings.
			d3.selectAll(".edge").each(function(d){ 
				var bWarning = d.warning;
				var bError = d.error;
				var crtEle = d3.select(this);
				if(bError && bWarning) {
					crtEle.classed("errorWarning", true)
				}
				else if(bError) {
					crtEle.classed("error", true)
				}
				else if(bWarning) {
					crtEle.classed("warning", true)
				}
			});
			
			//Update the UI of the edge decorator based on the errors and warnings.
			d3.selectAll(".edgeDecorator").each(function(d){ 
				var bWarning = d.warning;
				var bError = d.error;
				var crtEle = d3.select(this);
				if(bError && bWarning) {
					crtEle.classed("errorWarning", true)
							.classed("LineChargeDecoErrorWarning", true);
				}
				else if(bError) {
					crtEle.classed("error-stroke", true);
					if(crtEle.classed("lineChargeEdges")) {
						crtEle.style("fill", "url(#LineChargeGradientError)");
					}
				}
				else if(bWarning) {
					crtEle.classed("warning-stroke", true);
					if(crtEle.classed("lineChargeEdges")) {
						crtEle.style("fill", "url(#LineChargeGradientWarning)");
					}
				}
				else {/* Do logging here that no error or Warning.*/ }
			});
			
			//Only Errors for Nodes.
			d3.selectAll(".node, .nodeLabel").each(function(d){
				if(d.error) 
					d3.select(this).classed("error", true);
			});
			
			d3.selectAll(".topDecoratorGroup").each(function(d){
				var crtDecoGroup = d3.select(this);
				crtDecoGroup.selectAll(".topDecoCircle, .labelText ,.decorators ").each(function(d){ 
					if(typeof this.attributes.index !== "undefined") {
						var crtEle = d3.select(this);
						var index = this.attributes.index.value;
						var topDeco = d.topDecorators[index];
						var bWarning = topDeco.warning;
						var bError = topDeco.error;
				
						if(bError && bWarning) {
							crtEle.classed("errorWarning", true);
						}
						else if(bError) {
							crtEle.classed("error-stroke", true);
						}
						else if(bWarning) {
							crtEle.classed("warning-stroke", true);
						}
						else {/* Do logging here that no error or Warning.*/ }
					}
				});
			});
			
			//Only Warning for the Bottom Decorators.
			d3.selectAll(".bottomDecoratorGroup").each(function(d){
				var crtEle = d3.select(this);	
				for(var index = 0; index < d.bottomDecorators.length;index++) {
					if(d.bottomDecorators[index].warning) {
						crtEle.selectAll(".loadDecorator, .shuntDecorator").classed("warning", true)
						crtEle.selectAll(".decorators, polygon").classed("warning", true);
					}
				}
			});
		},
	}
})();