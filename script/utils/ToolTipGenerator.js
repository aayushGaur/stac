/** Tool-Tip generator Class : 
*	1. This class has been implemented as a static class under the sub namespace TOOLTIP
*	2. The method showToolTip and hideToolTip are called by the Network objects to display there relevant tool-tips.
*	3. It uses the rules for each object to display the custom tool tip on the object.	
*
**/
NETWORK.TOOLTIP = (function(){
	/**
	*	Internal mehtod of the Static class - Used to get the HTML for the tool-tip. 
	*	@param	d			The data element from which all the information is to be read.
	* 	@param	rules		The rules based on which the parsing is done.
	* 	Returns the HTML used to display the tool-Tip data.
	**/
	var getToolTipHtml = function(d,rules) {
		
		var warningHtml="", errorHtml="", toolTipHtml;
		toolTipHtml = "<table border='1' style='margin:0 auto; font-size:.74em;border-spacing:0'><tr><th>Property</th><th>Value</th><th>Units</th></tr>";
		for(var i = 0; i < rules.length; i++) {
			var key, units, type, classVal ,propVal = null;
			key = rules[i].key;
			units = rules[i].units;
			type = rules[i].type;
			classVal = rules[i].classed;
			//Custom tool-tip has been defined for properties for which a custom message is to be displayed to the user.
			if(typeof rules[i].custom === 'undefined' || (rules[i].custom).toLowerCase() === "false") {			
				var path = rules[i].data.split(".");
				for(var index = 0; index < path.length; index++) {
					if (propVal === null) { propVal = d[path[index]]; }
					else { propVal = propVal[path[index]];}
				}
			}
			else {
				var propVal = rules[i].data.toString();
			}
			
			if(typeof classVal === 'undefined' || classVal === null) { classVal = ""; }
			if(typeof units === 'undefined' || units === null || units==="-NA-") { units = ""; }
				
			if(typeof propVal === 'undefined' || propVal === null || propVal === "") {
					//Log here that the value of a tool-tip attr is undefined.
			}
			else {			
				if(key === "ToolTipTitle") {
					var toolTipTitle = "<div style='text-align:center'>"+ rules[i].preTitleValText + propVal + rules[i].postTitleValText + units + "</div>";
					toolTipHtml = toolTipTitle + toolTipHtml;
				}
				else if(typeof type !== 'undefined') {
					if(type === "error") {
							errorHtml = errorHtml +"<div>" + propVal + "</div>";
					}
					else if (type === "warning") {
						warningHtml = warningHtml +"<div>" + propVal + "</div>";
					}
				}
				else {
					toolTipHtml = toolTipHtml +"<tr>";
					toolTipHtml = toolTipHtml + "<td align='left'>" + key + "</td>";
					toolTipHtml = toolTipHtml + "<td align='right' class='"+ classVal +"'>" + propVal + "</td>";
					toolTipHtml = toolTipHtml + "<td>" + units+ "</td>";
					toolTipHtml = toolTipHtml +"</tr>";
				}
			}
		}
		toolTipHtml = toolTipHtml +"</table>";
		if(errorHtml !== "") { errorHtml = "<div class='toolTipError'><label style='text-decoration: underline;font-weight: bold;'>Errors:</label>" + errorHtml + "</div>"; }
		if(warningHtml !== "") { warningHtml = "<div class='toolTipWarning'><label style='text-decoration: underline;font-weight: bold;'>Warnings:</label>" + warningHtml + "</div>"; }		
		toolTipHtml = toolTipHtml + warningHtml +errorHtml;
		return toolTipHtml;
	};	
		
	
	//The Methods mentioned in the return are exposed as public methods for the Class (Implemented as pure Static).
	return {
		/**
		*	Used to display the relevant tool-tip HTML for the elements.
		*	@param	d			The element from which the information is to be read.
		*	@param	e			The d3 event using which the position of the tool-tip is set.
		*	@param	tipEle	The Element based on which the Network Rules are decided.
		**/
		showToolTip : function (d,e,tooltipRule) {
			var tipHtml = getToolTipHtml(d,tooltipRule);
			
			d3.select("#tooltip")
				.style("left", e.pageX + "px")
				.style("top", e.pageY + "px")
				.html(tipHtml)
				.classed("hidden", false);
		},
		
		/**
		*	Hides the tool-tip (is used for all the tool-tips of Network Elements).
		*	@param	d		The element on which the tool-tip is currently applied (passed to cater to future data needs).
		**/
		hideToolTip : function(d) {
			d3.select("#tooltip").classed("hidden", true);
		},
	}
})();