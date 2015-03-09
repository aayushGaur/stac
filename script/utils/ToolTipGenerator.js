/** Tool-T
ip generator Class : 
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
		
		var warningHtml="", errorHtml="", toolTipHtmlStatic, toolTipHtmlDynamic, bDynamicPresent = false;
		toolTipHtmlStatic = "<table border='1' style='margin:0 auto; font-size:.74em;border-spacing:0;width:100%;'><tr><th>Property</th><th>Value</th><th>Units</th></tr><tr><th colspan='3'>Static</th></tr>";
		toolTipHtmlDynamic = "<tr><th colspan='3'>Power Flow</th></tr>";
		for(var i = 0; i < rules.length; i++) {
			var key, units, type, classVal ,propVal = null, nature;
			key = rules[i].key;
			//Does the manipulation of the key...This has been added to support the dynamic keys for the solution data in the branch
			//The code for getting path based values of the place holder needs to be moved in a separate function.
			if(typeof key !== "string"){
				for(var phValsIndex = 0; phValsIndex < key.phVals.length; phValsIndex++) {
					var keyPHVal = key.phVals[phValsIndex].split(".");
					var keyPHActVal = null;
					for(var index = 0; index < keyPHVal.length; index++) {
						if (keyPHActVal === null) { keyPHActVal = d[keyPHVal[index]]; }
						else { keyPHActVal = keyPHActVal[keyPHVal[index]];}
					}
					key.kt = key.kt.replace(("%" + (phValsIndex + 1) + "%"),keyPHActVal);
				}
				//Setting the value of the key object to the string obtained so as to use the key in the tool-tip.
				key = key.kt;
			}
			
			units = rules[i].units;
			type = rules[i].type;
			classVal = rules[i].classed;
			nature = rules[i].nature;
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
					toolTipHtmlStatic = toolTipTitle + toolTipHtmlStatic;
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
					if(typeof nature !== 'undefined') {
						if(nature === "static") {
							toolTipHtmlStatic = toolTipHtmlStatic +"<tr>";
							toolTipHtmlStatic = toolTipHtmlStatic + "<td align='left'>" + key + "</td>";
							toolTipHtmlStatic = toolTipHtmlStatic + "<td align='right' class='"+ classVal +"'>" + propVal + "</td>";
							toolTipHtmlStatic = toolTipHtmlStatic + "<td>" + units+ "</td>";
							toolTipHtmlStatic = toolTipHtmlStatic +"</tr>";
						}
						else if (nature === "dynamic"){
							bDynamicPresent = true;
							toolTipHtmlDynamic = toolTipHtmlDynamic +"<tr>";
							toolTipHtmlDynamic = toolTipHtmlDynamic + "<td align='left'>" + key + "</td>";
							toolTipHtmlDynamic = toolTipHtmlDynamic + "<td align='right' class='"+ classVal +"'>" + propVal + "</td>";
							toolTipHtmlDynamic = toolTipHtmlDynamic + "<td>" + units+ "</td>";
							toolTipHtmlDynamic = toolTipHtmlDynamic +"</tr>";
						}
					}
					else {
							toolTipHtmlStatic = toolTipHtmlStatic +"<tr>";
							toolTipHtmlStatic = toolTipHtmlStatic + "<td align='left'>" + key + "</td>";
							toolTipHtmlStatic = toolTipHtmlStatic + "<td align='right' class='"+ classVal +"'>" + propVal + "</td>";
							toolTipHtmlStatic = toolTipHtmlStatic + "<td>" + units+ "</td>";
							toolTipHtmlStatic = toolTipHtmlStatic +"</tr>";
					}
				}
			}
		}
		
		//Add dynamic table only if the dynamic data is present.
		if(bDynamicPresent) {
			toolTipHtmlStatic = toolTipHtmlStatic + toolTipHtmlDynamic;
		}
		toolTipHtmlStatic = toolTipHtmlStatic +"</table>";
		
		if(errorHtml !== "") { errorHtml = "<div class='toolTipError'><label style='text-decoration: underline;font-weight: bold;'>Errors:</label>" + errorHtml + "</div>"; }
		if(warningHtml !== "") { warningHtml = "<div class='toolTipWarning'><label style='text-decoration: underline;font-weight: bold;'>Warnings:</label>" + warningHtml + "</div>"; }		
		toolTipHtmlStatic = toolTipHtmlStatic + warningHtml +errorHtml;
		return toolTipHtmlStatic;
	};	
		
	//Generic method - to be used to generate the tooltip for the help view.
	//The Complete functionality needs to be implemented after discussion with Dr. Carleton.
	var getHelpToolTipHtml = function(d,tooltipRule) {
		var toolTipHelp = "<div>";
		for(var index = 0; index < tooltipRule.length; index++) {
			var infoText = "<p style='margin:0'>";
			infoText += tooltipRule[index].data;
			for(var i = 0; i < tooltipRule[index].key.length;i++) {
				var path = tooltipRule[index].key[i].split(".");
				var propVal = null;
				
				for(var j = 0; j < path.length; j++) {
					if (propVal === null) { 
						propVal = d[path[j]];
					}
					else {
						propVal = propVal[path[j]];
					}
				}
				infoText = infoText.replace(("%"+ (i + 1) + "%"),propVal);
			}
			infoText += "</p>";
			toolTipHelp += infoText;
		}
		toolTipHelp += "</div>";
		return toolTipHelp;
	};
	
	//The Methods mentioned in the return are exposed as public methods for the Class (Implemented as pure Static).
	return {
		/**
		*	Used to display the relevant tool-tip HTML for the elements.
		*	@param	d			The element from which the information is to be read.
		*	@param	e			The d3 event using which the position of the tool-tip is set.
		*	@param	tipEle	The Element based on which the Network Rules are decided.
		*	@param	bHelp	Parameter used to define if the tooltip is being called for an element of the help graph (This parameter is honoured only if the value of passed is true (boolean).
		**/
		showToolTip : function (d,e,tooltipRule,bHelp) {
			var tipHtml;
			if(typeof bHelp !== "undefined") {
				if(bHelp === true) {
					tipHtml = getHelpToolTipHtml(d,tooltipRule);
				}
				else {
					console.log("Default tool-tip is being displayed. Please pass the correct value for the bHelp parameter.");
					tipHtml = getToolTipHtml(d,tooltipRule);
				}
			}
			else {
				tipHtml = getToolTipHtml(d,tooltipRule);
			}
			
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