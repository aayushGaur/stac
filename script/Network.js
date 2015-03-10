/*THIS FILE CONTAINS - 
1. Global Objects.
2. Class for Network Demo Graphs.
3. Class for Network Search Boxes.
4. Class for Network Help Graph.
*/

// Namespace for the Network - All the other namespaces except VIEWS are sub namespace of this.
var NETWORK = NETWORK || {};

/** Region - Global Objects used in the Network**/
//For zoom behaviour of the graph. This is required as the Zoom In and Zoom Out buttons are required with the graph.
var zoom = d3.behavior.zoom();

//Global object for holding the cola.d3adoptor. This object is used to perform all the UI object generation, calculating positions and graph layout switching.
var myCola;

//Global object for holding the cola.d3adoptor (for the help graph). This object performs all the functions performed by the myCola object.
var myColaHelp;

//For zoom behaviour of the help graph. This is required as the Zoom In and Zoom Out buttons are required to function separately with the help graph.
var zoomHelp = d3.behavior.zoom();

//Global object that holds the content of the FILE dropped.
var FILE;

//Global Object that holds all the meaningful Network data - parsed from the input file.
var NETWORK_OBJECTS;

/*Global Object Responsible for performing all types of logging realted to
 1. Internal (parsing or code failure).
 2. Configuration view - Warnings.
 3. Configuration view - Errors.
 4. Console logs.*/
var LOGGER;

/**Region ends - Global Objects **/

/***** Region - Class for Network Demo Graphs  *****/
(function(){
	NETWORK.DEMO.FileList = [
								{"filenName":"nesta_case14_ieee.m","filePath": "inputFiles/pub/nesta_case14_ieee.m"},
								{"filenName":"nesta_case24_ieee_rts.m","filePath": "inputFiles/pub/nesta_case24_ieee_rts.m"},
								{"filenName":"nesta_case73_ieee_rts.m","filePath": "inputFiles/pub/nesta_case73_ieee_rts.m"},
								{"filenName":"nesta_case118_ieee.m","filePath": "inputFiles/pub/nesta_case118_ieee.m"},
							];
	
	NETWORK.DEMO.Demo = function() {
	};
	
	NETWORK.DEMO.Demo.prototype.DrawDemoGraph = function(fileName) {
		var fileText = "";
		var filePath;
		(NETWORK.DEMO.FileList).forEach(function(file) {
			if(file.filenName === fileName) {
				filePath = file.filePath;
			}
		});
			
		$.ajax({
			type: "GET",
			url:   filePath,
			success: function(text) {
				//Setting the global variable to the value of the file read.
				drawDemoGraph(text);
			},
			error:   function() {
				console.log("The Network Failed to read the demo file. Please check if the file '"+ filePath +"' is present.");
			}
		});
	};
})(NETWORK.DEMO || (NETWORK.DEMO = {}));
/***** Region Ends *****/


/***** Region - Class for Network Search Boxes *****/
/**	This Class is responsible for providing the Search boxes for the Network Visualization.
*		The functionality provided for the Search boxes are a follows:
*		1. Auto complete with the relevant information that is to be associated with the search box.
*		2. Zoom in functionality over the element that has been selected in the search box.
*		This functionality needs to be discussed - Ability to store the user searches and use them as tagged information to show similar search options.???
*/
(function(){
	NETWORK.SearchBox = function(searchTags,sbDOMID) {
		this.searchTags = searchTags;
		this.DOMID = sbDOMID;
	};
	
	NETWORK.SearchBox.prototype.autoComplete  = function () {
		$(this.DOMID).autocomplete({
            source: this.searchTags,
			autoFocus: true,
			select: function (event,ui) {
				VIEWS.SharedFunctionality.zoomOnElement(ui.item.eleID)
			}
        });
	};
})(NETWORK || (NETWORK = {}));
/***** Region Ends *****/


//Network Help - This is class is responsible for the generation and maintenance of the help menu and the Help Graph.
//If any changes are made to this class; then the updates must be made in the base view as some functionality is shared by this class and the base view.
(function(){
	
	NETWORK.Help = function() {
		//The objects/elements in this Data object contains a 'helpDesc' attribute - this attribute is not present with the objects of the actual graph because it is only required for the help graph.
		this.DataObjects = {			
			BaseMVA:"100.0",branchDataObj:{"dataObjList":[{"index":1,"edgeId":"From Bus '1' to Bus '3'","source":0,"target":2,"edgeData":{"fbus":"1","tbus":"3","r":"0.065","x":"0.62","b":"0.45","rateA":"9000.0","rateB":"0.0","rateC":"0.0","ratio":"0.0","angle":"0.0","status":"1","angmin":"-30.0","angmax":"30.0","UB":100.47227335656343},"edgeType":"LineCharge","edgeName":"1-3-3-1-1","isMultiLine":false,"solutionData":{"angle":0,"r":0.065,"ratio":1,"b":-1.5953682856223865,"g":0.16725635252492763,"p-s-t":"51.3072","q-s-t":"10.0763","p-t-s":"-49.1456","q-t-s":"-34.9085","s-s-t":"52.2873","s-t-s":"60.2818"}},{"index":2,"edgeId":"From Bus '3' to Bus '2'","source":2,"target":1,"edgeData":{"fbus":"3","tbus":"2","r":"0.025","x":"0.75","b":"0.7","rateA":"50.0","rateB":"0.0","rateC":"0.0","ratio":"0.0","angle":"0.0","status":"1","angmin":"-30.0","angmax":"30.0","UB":83.46592147010031},"edgeType":"Standard","edgeName":"3-2-2-3-1","isMultiLine":false,"solutionData":{"angle":0,"r":0.025,"ratio":1,"b":-1.3318534961154274,"g":0.044395116537180916,"p-s-t":"-45.8545","q-s-t":"-19.9341","p-t-s":"46.5253","q-t-s":"-18.3140","s-s-t":"50.0000","s-t-s":"50.0001"}},{"index":3,"edgeId":"From Bus '1' to Bus '2'","source":0,"target":1,"edgeData":{"fbus":"1","tbus":"2","r":"0.042","x":"0.9","b":"0.3","rateA":"9000.0","rateB":"0.0","rateC":"0.0","ratio":"0.0","angle":"0.0","status":"1","angmin":"-30.0","angmax":"30.0","UB":69.51790934997776},"edgeType":"Transformer","edgeName":"1-2-2-1-1","isMultiLine":false,"solutionData":{"angle":0,"r":0.042,"ratio":1,"b":-1.1086966162579273,"g":0.05173917542536994,"p-s-t":"-13.2403","q-s-t":"4.6210","p-t-s":"13.4811","q-t-s":"-30.4772","s-s-t":"14.0235","s-t-s":"33.3257"}}]},busDataObj:{"dataObjList":[{"bus_i":"Bus1","helpDesc":"1", "type":"3","Pd":"110.0","Qd":"40.0","Gs":"1.0","Bs":"1.0","area":"1","Vm":"1.10000","Va":"0.00000","baseKV":"240.0","zone":"1","Vmax":"1.10000","Vmin":"0.90000","topDecorators":[{"id":1,"helpDesc":"voltage controlled generator","type":"generator","text":"~","topDecoData":{"bus":"1","Pg":"148.067","Qg":"54.697","Qmax":"1000.0","Qmin":"-1000.0","Vg":"1.1","mBase":"100.0","status":"1","Pmax":"2000.0","Pmin":"0.0","Pc1":"0.0","Pc2":"0.0","Qc1min":"0.0","Qc1max":"0.0","Qc2min":"0.0","Qc2max":"0.0","ramp_agc":"0.0","ramp_10":"0.0","ramp_30":"0.0","ramp_q":"0.0","apf":"0.0","Pd":"110.0","Qd":"40.0","id":1,"DOMID":"bus1topDecoHelp","costData":{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.110000","cost2":"5.000000","cost3":"0.000000"}}}],"GenIdList":"1","bottomDecorators":[{"type":"shunt","helpDesc":"constant power load and a shunt element","Pd":"110.0","Qd":"40.0","Gs":"0.0","Bs":"0.0","DOMID":"bus1bottomDecoHelp"},{"type":"load","helpDesc":"constant power load and a shunt element","Pd":"110.0","Qd":"40.0","Gs":"0.0","Bs":"0.0","DOMID":"bus2bottomDecoHelp"}],"status":1,"solData":{"Va":0}},{"bus_i":"Bus2","helpDesc":"2","type":"2","Pd":"110.0","Qd":"40.0","Gs":"0.0","Bs":"0.0","area":"1","Vm":"0.92617","Va":"7.25886","baseKV":"240.0","zone":"1","Vmax":"1.10000","Vmin":"0.90000","topDecorators":[],"GenIdList":"2","bottomDecorators":[{"type":"shunt","helpDesc":"shunt element","Pd":"110.0","Qd":"40.0","Gs":"0.0","Bs":"0.0","DOMID":"bus2bottomDecoHelp"}],"status":1,"solData":{"Va":0.1266910069413156}},{"bus_i":"Bus3","helpDesc":"3","type":"2","Pd":"95.0","Qd":"50.0","Gs":"0.0","Bs":"0.0","area":"1","Vm":"0.90000","Va":"-17.26711","baseKV":"240.0","zone":"1","Vmax":"1.10000","Vmin":"0.90000","topDecorators":[{"id":3,"helpDesc":"synchronous condenser","type":"synCondensor","text":"c","topDecoData":{"bus":"3","Pg":"0.0","Qg":"-4.843","Qmax":"1000.0","Qmin":"-1000.0","Vg":"0.9","mBase":"100.0","status":"1","Pmax":"0.0","Pmin":"0.0","Pc1":"0.0","Pc2":"0.0","Qc1min":"0.0","Qc1max":"0.0","Qc2min":"0.0","Qc2max":"0.0","ramp_agc":"0.0","ramp_10":"0.0","ramp_30":"0.0","ramp_q":"0.0","apf":"0.0","Pd":"95.0","Qd":"50.0","id":3,"DOMID":"bus3topDecoHelp","costData":{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.000000","cost2":"0.000000","cost3":"0.000000"}}}],"GenIdList":"3","bottomDecorators":[{"type":"load","helpDesc":"constant power load","Pd":"95.0","Qd":"50.0","Gs":"0.0","Bs":"0.0","DOMID":"bus3bottomDecoHelp"}],"status":1,"solData":{"Va":-0.30136792180403804}}]},generatorCostDataObj:{"dataObjList":[{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.110000","cost2":"5.000000","cost3":"0.000000"},{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.085000","cost2":"1.200000","cost3":"0.000000"},{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.000000","cost2":"0.000000","cost3":"0.000000"}]},generatorDataObj:{"dataObjList":[{"bus":"1","Pg":"148.067","Qg":"54.697","Qmax":"1000.0","Qmin":"-1000.0","Vg":"1.1","mBase":"100.0","status":"1","Pmax":"2000.0","Pmin":"0.0","Pc1":"0.0","Pc2":"0.0","Qc1min":"0.0","Qc1max":"0.0","Qc2min":"0.0","Qc2max":"0.0","ramp_agc":"0.0","ramp_10":"0.0","ramp_30":"0.0","ramp_q":"0.0","apf":"0.0","Pd":"110.0","Qd":"40.0","id":1,"DOMID":"bus1topDecoHelp","costData":{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.110000","cost2":"5.000000","cost3":"0.000000"}},{"bus":"2","Pg":"170.006","Qg":"-8.791","Qmax":"1000.0","Qmin":"-1000.0","Vg":"0.92617","mBase":"100.0","status":"1","Pmax":"2000.0","Pmin":"0.0","Pc1":"0.0","Pc2":"0.0","Qc1min":"0.0","Qc1max":"0.0","Qc2min":"0.0","Qc2max":"0.0","ramp_agc":"0.0","ramp_10":"0.0","ramp_30":"0.0","ramp_q":"0.0","apf":"0.0","Pd":"110.0","Qd":"40.0","id":2,"DOMID":"bus2topDecoHelp","costData":{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.085000","cost2":"1.200000","cost3":"0.000000"}},{"bus":"3","Pg":"0.0","Qg":"-4.843","Qmax":"1000.0","Qmin":"-1000.0","Vg":"0.9","mBase":"100.0","status":"1","Pmax":"0.0","Pmin":"0.0","Pc1":"0.0","Pc2":"0.0","Qc1min":"0.0","Qc1max":"0.0","Qc2min":"0.0","Qc2max":"0.0","ramp_agc":"0.0","ramp_10":"0.0","ramp_30":"0.0","ramp_q":"0.0","apf":"0.0","Pd":"95.0","Qd":"50.0","id":3,"DOMID":"bus3topDecoHelp","costData":{"GenID":"2","startup":"0.0","shutdown":"0.0","n":"3","cost1":"0.000000","cost2":"0.000000","cost3":"0.000000"}}]}
		};
	};
	
	NETWORK.Help.prototype.drawGraph = function() {
			
		var networkConfigObj = this.DataObjects;
		var width = 1400, height = 1500;
		var width = (window.innerWidth * .98) - (VIEWS.SharedFunctionality.R * 2);
		var height = (window.innerHeight *.70) + (VIEWS.SharedFunctionality.R * 1);
		
		myColaHelp = cola.d3adaptor().linkDistance(VIEWS.SharedFunctionality.R * 12).avoidOverlaps(true).size([width, height]);
		
		var helpSvg = d3.select("body").append("svg").attr({"id":"helpSvgNode","pointer-events": "all",}).on("dblclick.zoom", null);
		
		helpSvg.append('rect').attr({'class':'backgroundHelp','fill':'wheat','width':"100%",'height':"100%","style":"stroke-width:4;stroke:grey"}).call(zoomHelp.on("zoom", redrawHelpWithDrag));
		
		//Appending help label after the rectangle because in the svg elements appear in the order in which they are appended.
		helpSvg.append('text').attr({'id':'helpGraphLabel','class':'helpLabelText','width':"100px","x":"50","y":"50",'height':"100px","style":"stroke-width:.25;stroke:black"}).text("Mouseover an element for a description.");
		
		function redrawHelpWithDrag() {
			if (VIEWS.SharedFunctionality.nodeMouseDown) return;
			visHelp.attr("transform", "translate(" + zoomHelp.translate() + ") scale(" + zoomHelp.scale() + ")");
		}	
		var visHelp = helpSvg.append("g").attr("id", "helpSvgGraph");

		helpSvg.on("mousedown.zoom", null);
		helpSvg.on("mousemove.zoom", null);
		helpSvg.on("dblclick.zoom", null);
		helpSvg.on("touchstart.zoom", null);
		helpSvg.on("wheel.zoom", null);
		helpSvg.on("mousewheel.zoom", null);
		helpSvg.on("MozMousePixelScroll.zoom", null);
			
		var nodesData = networkConfigObj.busDataObj.dataObjList;
		var edgesData = networkConfigObj.branchDataObj.dataObjList;
		var standardEdgesData = [], transformerEdgesData = [], lineChargeEdgesData = [],MultiLineEdgesData = [], multiEdgeName = "",edgeCouple = [];

		for(var edgeIndex = 0; edgeIndex < edgesData.length; edgeIndex++) {
			var crtEdge = edgesData[edgeIndex];
			if(crtEdge.edgeType === "Standard" && !crtEdge.isMultiLine) {				
				standardEdgesData.push(crtEdge);
			}
			else if(crtEdge.edgeType === "Transformer" && !crtEdge.isMultiLine) {
				transformerEdgesData.push(crtEdge);
			}
			else if(crtEdge.edgeType === "LineCharge" && !crtEdge.isMultiLine) {
				lineChargeEdgesData.push(crtEdge);
			}
			else if (crtEdge.isMultiLine) {	
				if(multiEdgeName==="") {
					multiEdgeName = crtEdge.edgeName.slice(0,-2);
					edgeCouple.push(crtEdge);
				}
				else if (multiEdgeName === crtEdge.edgeName.slice(0,-2)){
					edgeCouple.push(crtEdge);
					multiEdgeName = "";
					MultiLineEdgesData.push(edgeCouple);
					edgeCouple=[];
				}
			}
		}
		
		var standardEdges = new NETWORK.GRAPH.StandardEdges(visHelp,standardEdgesData);
		var transformerEdges = new NETWORK.GRAPH.TransformerEdges(visHelp,transformerEdgesData);
		var lineChargeEdges = new NETWORK.GRAPH.LineChargeEdges(visHelp,lineChargeEdgesData);
		
		var MultiLineEdges=[];
		for(var multiIndex = 0; multiIndex<MultiLineEdgesData.length;multiIndex++) {
				MultiLineEdges.push(new NETWORK.GRAPH.MultiLineEdges(vis,MultiLineEdgesData[multiIndex],multiIndex));
		}
		var nodes = new NETWORK.GRAPH.Nodes(nodesData,visHelp,myColaHelp);
		
		myColaHelp.nodes(nodesData).links(edgesData).start();
		$("#helpSvgGraph").find(".nodeLabel").each(function() {
				$(this).text($(this).text().replace("Bus",""));
		});
		
		myColaHelp.on("tick", function () {
			nodes.tick();
			standardEdges.tick(VIEWS.SolutionView.viewMe);
			transformerEdges.tick();
			lineChargeEdges.tick();
			for(var multiIndex = 0; multiIndex<MultiLineEdges.length;multiIndex++) {
				MultiLineEdges[multiIndex].tick();
			}
			
			//Added to center the help label text on the page.
			d3.select("#helpGraphLabel").attr("x",function(d) {
				return (($("#helpSvgNode").width()/2) - 150);
			});
		});
	};
	
	NETWORK.Help.prototype.updateToolTip = function() {
		//For all the elements only the mouse over needs to be updated as the mouse out function is same for all the elements in both the graphs.
		d3.select("#helpSvgNode").selectAll(".edgeDecorator,.edge")
								.on("mouseover", function (d) {
									var helpRule="";
									switch(d.edgeType) {
										case"Standard":
											helpRule = NETWORK.RULES.edgeHelpToolTip;
										break;
										case"LineCharge":
											helpRule = NETWORK.RULES.edgeLineChargeHelpToolTip;
										break;
										case"Transformer":
											helpRule = NETWORK.RULES.edgeTransformerHelpToolTip;
										break;
									}
									NETWORK.TOOLTIP.showToolTip(d,d3.event,helpRule,true);
								});
								
		d3.select("#helpSvgNode").selectAll(".node,.nodeLabel")
								.on("mouseover", function (d) {
									NETWORK.TOOLTIP.showToolTip(d,d3.event,NETWORK.RULES.busHelpToolTip,true);
								});
								
		d3.select("#helpSvgNode").selectAll(".topDecoCircle,.topDecoratorText")
								.on("mouseover", function (d) {
									var index = $(this).attr('index');
									NETWORK.TOOLTIP.showToolTip(d.topDecorators[index],d3.event,NETWORK.RULES.topDecoHelpToolTip,true);
								});
		
		d3.select("#helpSvgNode").selectAll(".bottomDecoratorGroup").on("mouseover", function (d) {
									console.log(d);
									if(d.bottomDecorators.length === 1) {
										NETWORK.TOOLTIP.showToolTip(d,d3.event,NETWORK.RULES.bottomDecoHelpToolTip,true);
									}
									
									else {
										NETWORK.TOOLTIP.showToolTip(d,d3.event,NETWORK.RULES.bottomDecoHelpToolTip,true);
									}
								});
								
		d3.select("#helpSvgNode").selectAll(".bottomDecoratorGroup").selectAll(".decorators")
								.on("mouseover", function (d) {
								});
	};
})(NETWORK || (NETWORK = {}));