//Sub Class for Data view - Implemented as a static class.
VIEWS.DataView = (function(){
	return {
		returnToView: function() {
			d3.select("#parentSvgNode").selectAll(".warning").each(function(d) {d3.select(this).classed("warning", false); });
			d3.select("#parentSvgNode").selectAll(".warning-stroke").each(function(d) {d3.select(this).classed("warning-stroke", false); });
			d3.select("#parentSvgNode").selectAll(".error").each(function(d) {d3.select(this).classed("error", false); });
			d3.select("#parentSvgNode").selectAll(".error-stroke").each(function(d) { d3.select(this).classed("error-stroke", false); });
			d3.select("#parentSvgNode").selectAll(".errorWarning").each(function(d) { d3.select(this).classed("errorWarning", false); });
			d3.select("#parentSvgNode").selectAll(".error-fill").each(function(d) { d3.select(this).classed("error-fill", false); });
			d3.select("#parentSvgNode").selectAll(".warning-fill").each(function(d) { d3.select(this).classed("warning-fill", false); });
			
			//For Line Charge Decorators.
			d3.select("#parentSvgNode").selectAll(".LineChargeDecoErrorWarning, .lineChargeEdges").classed("LineChargeDecoErrorWarning", false)
																								.attr("style", function(d) {
																										//Checking if the status of the element is ON or OFF as this is required for the Charge Line Edge Decorator.
																										if(this.className.baseVal.indexOf("OffStatus") !== -1) {
																											return "fill:url(#LineChargeGradientOffStatus);";
																										}
																										else {
																											return "fill:url(#LineChargeGradient);";
																										}
																									});
		},
	}
})();