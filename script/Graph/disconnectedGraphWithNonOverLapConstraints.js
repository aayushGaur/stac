//METHOD TO DRAW THE DISCONNECTED GRAPH
function DisconnectedGraph(){
	//Cleaning the old values in the variables and DOM.
	d3.select("svg").remove();
	VIEWS.SharedFunctionality.nodeMouseDown = false;
	$("#dataView").addClass('activeButton');
	$("#dataValidationView").removeClass('activeButton');
	
	//Commented as the dropInput box is hidden once the file has been loaded for the first time on the page.
	//Also with the new functionality the user will be able to drag drop the file anywhere on the page.
	/*$("#dropInput").removeClass("dropAlongWithGraphConfig");
	$("#dropInput").addClass("dropAlongWithGraphTopology");*/
	$("#dropInput").hide();
	
	var helper = new NETWORK.Help();
	helper.drawGraph();
	helper.updateToolTip();
	
	//Calling the graph object.
	drawDisconnectedGraph();
	
}	

/** Draws the disconnected Graph. (If there are no disconnected nodes in the input - No disconnected nodes will be displayed in the graph).*/
function drawDisconnectedGraph() {
	var width = 1400, height = 1500;
	var width = (window.innerWidth * .98) - (VIEWS.SharedFunctionality.R * 2);
	var height = (window.innerHeight *.70) + (VIEWS.SharedFunctionality.R * 1);
			
    var color = d3.scale.category20();
	
    myCola = cola.d3adaptor().linkDistance( VIEWS.SharedFunctionality.R * 6).avoidOverlaps(true).size([width, height]);
	
	var svg = d3.select("body").append("svg").attr({"id":"parentSvgNode","pointer-events": "all"}).on("dblclick.zoom", null);
	
	svg.append('rect').attr({'class':'background','width':"100%",'height':"100%","style":"stroke-width:4;stroke:grey"}).call(zoom.on("zoom", redrawWithDrag));
	
	function redrawWithDrag(transition) {
		if (VIEWS.SharedFunctionality.nodeMouseDown) return;
			(transition ? vis.transition() : vis)
				.attr("transform", "translate(" + zoom.translate() + ") scale(" + zoom.scale() + ")");
	}	
	
	var vis = svg.append("g").attr("id", "svgGraph");

	svg.on("mousedown.zoom", null);
	svg.on("mousemove.zoom", null);
	svg.on("dblclick.zoom", null);
	svg.on("touchstart.zoom", null);
	svg.on("wheel.zoom", null);
	svg.on("mousewheel.zoom", null);
	svg.on("MozMousePixelScroll.zoom", null);
		
	var nodesData = NETWORK_OBJECTS.busDataObj.dataObjList;
	var edgesData = NETWORK_OBJECTS.branchDataObj.dataObjList;	

	//NOTE - THE LOGIC FOR GENERATION OF MULTI LINE NEEDS TO BE CORRECTED - THE CURRENT LOGIC GENERATES THE LINES BUT VIOLATES THE CLASS STRUCTURE. 
	// THIS NEEDS TO BE FIXED.
	var standardEdgesData = [], transformerEdgesData = [], lineChargeEdgesData = [],MultiLineEdgesData = [], multiEdgeName = "",edgeCouple = [];

	//Sorting the edge data to support cases like 'nesta_case29_edin.m' where the branches are all jumbled up.
	edgesData = edgesData.sort(
		function compare(a,b) {
			if (a.edgeName < b.edgeName)
				return -1;
			if (a.edgeName > b.edgeName)
				return 1;
			return 0;
		}
	);
	
	for(var edgeIndex = 0; edgeIndex <edgesData.length; edgeIndex++) {
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
			if(multiEdgeName !== crtEdge.edgeName.slice(0,-2)) {
				edgeCouple=[];
				multiEdgeName = crtEdge.edgeName.slice(0,-2);
				edgeCouple.push(crtEdge);
			}
			else if (multiEdgeName === crtEdge.edgeName.slice(0,-2)){
				edgeCouple.push(crtEdge);
				multiEdgeName = crtEdge.edgeName.slice(0,-2);
				MultiLineEdgesData.push(edgeCouple);
			}
		}
	}
	
	var standardEdges = new NETWORK.GRAPH.StandardEdges(vis,standardEdgesData);
	var transformerEdges = new NETWORK.GRAPH.TransformerEdges(vis,transformerEdgesData);
	var lineChargeEdges = new NETWORK.GRAPH.LineChargeEdges(vis,lineChargeEdgesData);
	

	var MultiLineEdges=[];
	for(var multiIndex = 0; multiIndex<MultiLineEdgesData.length;multiIndex++) {
			MultiLineEdges.push(new NETWORK.GRAPH.MultiLineEdges(vis,MultiLineEdgesData[multiIndex],multiIndex));
	}
	
	var nodes = new NETWORK.GRAPH.Nodes(nodesData,vis,myCola);
	
	//This variable has been added to check if the graph file being loaded has fixed locations or not.
	//If the graph being loaded has fixed locations then the zoomToFit is called again.
	var fixedLocationGraphLoad = false;
	if(typeof NETWORK_OBJECTS.busLocation !== "undefined") {
		fixedLocationGraphLoad = true;
		VIEWS.SharedFunctionality.hasNodeLocationData = true;
		VIEWS.SharedFunctionality.autoLayout = false;
		$("#fixedPosition").removeClass('activeButton').hover(function(){
			//Do nothing on the hover in this case.
			$(this).css({ background : 'grey', color : 'white' });
		}, function(){
				$(this).css({ background : 'white', color : 'grey' });
		});
		$("#autoLayoutToggle").removeClass('activeButton');
	}
	else {
		VIEWS.SharedFunctionality.hasNodeLocationData = false;
		VIEWS.SharedFunctionality.autoLayout = true;
		$("#fixedPosition").removeClass('activeButton').hover(function(){ 
			$(this).css({ border: '2px solid grey', color : 'grey', background : 'white' });
		}, function(){ 
			$(this).css({ border: '2px solid grey', color : 'grey', background : 'white' });
		});
		$("#autoLayoutToggle").addClass('activeButton');
		
	}
	
	
	$("#saveLayout").removeClass('activeButton').hover(function(){
			$("#saveLayout *").css({ background : 'grey', color : 'white' });
		}, function(){
				$("#saveLayout *").css({ background : 'white', color : 'grey' });
		});
	//Added the last parameters to solve the initial auto fit issue.
	
	
	myCola.nodes(nodesData).links(edgesData).start(10,10,10);
	//Interchange the x and y for the nodes in the graph based on the height and width of the graph.
	// Here the Cola object is used instead of the SVG object.
	if(myCola.size()[0]>myCola.size()[1]) {
		myCola.nodes().forEach(function(node) {
			var a = node.x;
			node.x = node.y;
			node.y = a;
		});
	}
	
	//Called the Start for the COLA to allow the updates to be done after changing the orientation of the graph.
	myCola.nodes(nodesData).links(edgesData).start();
	VIEWS.SharedFunctionality.zoomToFit(true);
	
	//Hides the snippet as soon as the graph auto fits on the page.
	$("#LoadSnippet").hide();

	myCola.on("tick", function () {
		
		if(VIEWS.SharedFunctionality.goToInitialStateTriggered && $("#parentSvgNode").is(":visible")) {
			if(VIEWS.SharedFunctionality.autoLayout) {
				d3.selectAll(".node").each(function(d){
					var nodePositions = NETWORK_OBJECTS.busLocation.dataObjList;
					for(var index = 0; index < nodePositions.length; index++) {
						if (d.bus_i === nodePositions[index].bus_i) {
							d.px = parseFloat(nodePositions[index].x);
							d.py = parseFloat(nodePositions[index].y);
							d.x = parseFloat(nodePositions[index].x);
							d.y = parseFloat(nodePositions[index].y);
							d.fixed |= 8;
						}
					}
				});
			}
			else {
				d3.selectAll(".node").each(function(d){
					var nodePositions = NETWORK_OBJECTS.busLocation.dataObjList;
					for(var index = 0; index < nodePositions.length; index++) {
						if (d.bus_i === nodePositions[index].bus_i) {
							d.px = parseFloat(nodePositions[index].x);
							d.py = parseFloat(nodePositions[index].y);
							d.x = parseFloat(nodePositions[index].x);
							d.y = parseFloat(nodePositions[index].y);
						}
					}
				});
			}
			/* Setting the value of the trigger to false as the required action for one trigger has been done*/
			VIEWS.SharedFunctionality.goToInitialStateTriggered = false;
		}
		else {
			if(VIEWS.SharedFunctionality.autoLayout) {				
				d3.selectAll(".node").each(function(d){ d.fixed &= ~8; });
			}
			else if(fixedLocationGraphLoad) {
					if(VIEWS.SharedFunctionality.hasNodeLocationData) {
						d3.selectAll(".node").each(function(d){
						var nodePositions = NETWORK_OBJECTS.busLocation.dataObjList;
						for(var index = 0; index < nodePositions.length; index++) {
							if (d.bus_i === nodePositions[index].bus_i) {
								d.px = parseFloat(nodePositions[index].x);
								d.py = parseFloat(nodePositions[index].y);
								d.x = parseFloat(nodePositions[index].x);
								d.y = parseFloat(nodePositions[index].y);
								d.fixed |= 8;
							}
						}
					});
					VIEWS.SharedFunctionality.zoomToFit(true);
					//Setting the variable as false the the zoomToFit is to be called only once.
					fixedLocationGraphLoad = false;
				}
			}
		}
		nodes.tick();
		//Added a check on the count of the edges as in some test cases there are no transformer or lineCharge edges.
		standardEdges.tick();
		transformerEdges.tick();
		lineChargeEdges.tick();
		for(var multiIndex = 0; multiIndex<MultiLineEdges.length;multiIndex++) {
			MultiLineEdges[multiIndex].tick();
		}
	});
}