//NOTE - ALL THE FUNCTIONS OF THIS FILE ARE TO BE MOVED IN THE NETWORK NAMESPACE - 12/02/2015

//NOTE -- IMPORTANT FOR THE DEVELOPER -- UPDATE THE METHODS TO DRAW ALL THE GRAPHS IN ONE FUNCTION AND IT SHOULD BE IN THE NETWORK NAMESPACE.

/**
*	Performs the function of reading the dropped file and create the Data Objects after parsing of the file.
*	Updated to call the drawDisconnectedGraph function - as no special user input is required once the input file has been dropped on the page.
*	- Stores the file in the Global Object FILE.
*	- Stores the Data Objects in the Global Object NETWORK_OBJECTS
*	@ param		The event that is triggered when the file is dropped (The default functionality has already been suppressed).
**/
function drawGraph(event) {
	preProcessNetworkUI();
	NETWORK_OBJECTS = null;
	FILE = null;
	var parserError = false;
	/*Capture the FILE from the target or the dataTransfer prop.
	var files = event.target.files || event.dataTransfer.files || event.originalEvent.dataTransfer.files;*/
	var files;
	var reader = new FileReader();
	
	if(typeof event.dataTransfer === 'undefined') {
		files = event.originalEvent.dataTransfer.files;
	}
	else {	
		files = event.dataTransfer.files;
	}	
	
	/*Checks if the file can be loaded and then event.target.result is used to capture file data as 
	the reader.result can contain either the file or error.*/
	reader.onload = function(event) { 
		FILE = event.target.result;
		try {
			var ObjectFactory = new NETWORK.ObjectFactory();
			NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
			var Solution = new NETWORK.Solution(NETWORK_OBJECTS);
		}
		catch(error) {
				parserError = true;
		}
		/*Logging NETWORK_OBJECTS for reference purpose.*/
		console.log(NETWORK_OBJECTS);
		
		
		/*var e1, e2, e3, e4, e5;
		e1 = JSON.stringify(NETWORK_OBJECTS.BaseMVA);
		e2 = JSON.stringify(NETWORK_OBJECTS.branchDataObj);
		e3 = JSON.stringify(NETWORK_OBJECTS.busDataObj);
		e4 = JSON.stringify(NETWORK_OBJECTS.generatorCostDataObj);
		e5 = JSON.stringify(NETWORK_OBJECTS.generatorDataObj);
		console.log(e1);
		console.log(e2);
		console.log(e3);
		console.log(e4);
		console.log(e5);
		var export = e1 + e2 + e3 + e4 + e5;
		
		var blob = new Blob([export], {type: 'text/json'});
        e    = document.createEvent('MouseEvents');
        a    = document.createElement('a');

		a.download = "objects";
		a.href = window.URL.createObjectURL(blob);
		a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);*/
		
		
		if(!parserError) {
			setTimeout(function() {
				$("#d3div").css("display","block");
				VIEWS.SharedFunctionality.autoLayout = true;
				$(".standardNetworkGroup, #developedInfo").css("display","none");
				DisconnectedGraph();
				/**Region Begins  - Validate the NETWORK_OBJECTS and add the warning and errors 
					Validation is done after the graph is drawn so as to avoid lag for larger networks .
					Also the NETWORK Object get updated i.e. the source and the target of the edge data are populated as objects and not just numbers.
					NEEDS TO BE INVESTIGATED - HOW THIS HAPPENS.**/
				var dataValidator = new NETWORK.Validator(NETWORK_OBJECTS);
				dataValidator.validateEdges();
				dataValidator.validateNode();
				
				//Show the graph as soon as the graph starts rendering.
				LOGGER.toggleErrorsAndWarnings(true);
				
				var ewMessages = LOGGER.errorMessages.concat(LOGGER.warningMessages);
				var searchBox2 = new NETWORK.SearchBox(ewMessages,"#ewSearch");
				searchBox2.autoComplete();
				
				var availableBusID = [];
				NETWORK_OBJECTS.busDataObj.dataObjList.forEach(function(entry) {
					var busData = {value:entry.bus_i, eleID:entry.DOMID,eleType:"node"};
					availableBusID.push(busData);
				});
				var searchBox1 = new NETWORK.SearchBox(availableBusID,"#tags");
				searchBox1.autoComplete();
				
			/*****Region Ends*****/
			},1500);
		}
		else {
			$("#LoadSnippet").hide();
			$("#dropInput").html("Load Matpower case");
			alert("Unable to parse the input file.");
		}
	}
	
	/*Custom message in case of error while reading the file.*/
	reader.onerror = function(event) {
		console.log("The reader failed to read the input file.");
		console.log("Please check the file again....The simulation will not work if this step does not happen correctly.");
		alert("Failed to load the input file!!!");
	}
	reader.readAsText(files[0]);
}

/**
*	Draws the Network Graph for the demo.
*	Creates the NETWORK_OBJECTS and then calls the standard functions to create the demo graphs.
* @param	file	The file object that is read from the server.
**/
function drawDemoGraph(file) {
	preProcessNetworkUI();
	FILE = file;
	var ObjectFactory = new NETWORK.ObjectFactory();
	NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
	var Solution = new NETWORK.Solution(NETWORK_OBJECTS);
	
	setTimeout(function() {
		$("#d3div").css("display","block");
		VIEWS.SharedFunctionality.autoLayout = true;
		$(".standardNetworkGroup, #developedInfo").css("display","none");
		DisconnectedGraph();
		/**Region Begins  - Validate the NETWORK_OBJECTS and add the warning and errors 
			Validation is done after the graph is drawn so as to avoid lag for larger networks .
			Also the NETWORK Object get updated i.e. the source and the target of the edge data are populated as objects and not just numbers.
			NEEDS TO BE INVESTIGATED - HOW THIS HAPPENS.**/
		var dataValidator = new NETWORK.Validator(NETWORK_OBJECTS);
		dataValidator.validateEdges();
		dataValidator.validateNode();
		
		//Show the graph as soon as the graph starts rendering.
		LOGGER.toggleErrorsAndWarnings(true);
		
		var ewMessages = LOGGER.errorMessages.concat(LOGGER.warningMessages);
		var searchBox2 = new NETWORK.SearchBox(ewMessages,"#ewSearch");
		searchBox2.autoComplete();
		
		var availableBusID = [];
		NETWORK_OBJECTS.busDataObj.dataObjList.forEach(function(entry) {
			var busData = {value:entry.bus_i, eleID:entry.DOMID,eleType:"node"};
			availableBusID.push(busData);
		});
		var searchBox1 = new NETWORK.SearchBox(availableBusID,"#tags");
		searchBox1.autoComplete();
		/*****Region Ends*****/
	},1500);
}

//Performs stop propagation and prevents the browser from bubbling up the event.
function stopPropagationAndPreventDefault(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
}

//Prepares the page for interaction with the user.
function preparePageForInteraction() {
	var collection =document.getElementsByClassName('dropEnabled');
	/*** Investigative Region to check the overlay on the whole page***/
	$(window).bind('dragover', dragover);
	$(window).bind('drop', drop);
	$('.overlay').bind('dragleave', dragleave);
	var tid;

	function dragover(event) {
		clearTimeout(tid);
		event.stopPropagation();
		event.preventDefault();
		$('.overlay').show();
		return false;
	}

	function dragleave(event) {
		tid = setTimeout(function(){
		event.stopPropagation();
		event.preventDefault();
		$('.overlay').hide();
		}, 300);
		return false;
		
	}

	function drop(event) {
		event.stopPropagation();
		event.preventDefault();
		drawGraph(event);
		$('.overlay').hide();
		return false;
	}
	/***Investigative Region ends***/
	
	for (var i = 0; i < collection.length; i++) {
		//Prevents all the default drag and drop events from executing.
		addEventHandler(collection[i], 'dragstart', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragenter', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragleave', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragover', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragenter', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragend', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'drop', stopPropagationAndPreventDefault);
	}
}
	
function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        obj.addEventListener(evt, handler, false); // Standard Method
    } 
	else if(obj.attachEvent) {
        obj.attachEvent('on'+evt, handler); // For IE
    }
	else {
        obj['on'+evt] = handler; // For older browsers
    }
}

function preProcessNetworkUI() {
	//Performs the garbage collection on the Logger and clears the stored messages.
	LOGGER.collectGarbage();
	
	//Added to clear the search boxes when a new graph loads.
	$("#ewSearch").val("");
	$("#tags").val("");
	
	
	if($("#d3div").css("display") !== 'block') {
		$("#dropInput").html("");
		$("#LoadSnippet").show();
		var p = $("#dropInput").position();
		var marginLeft = parseFloat($("#dropInput").css('marginLeft'));
		
		var h = $("#dropInput").height();
		var w = $("#dropInput").width();
		var top = (p.top + h/2)-22;
		var left = (p.left + w/2) + marginLeft-18; 
		$("#LoadSnippet").css({'top': top, 'left': left, 'position':'absolute', 'z-index':'100'});
	}
	else {
		var h = $("#parentSvgNode").height();
		var w = $("#parentSvgNode").width();
		d3.select("svg").remove();
		
		//Commented as the dropInput box is hidden once the file has been loaded for the first time on the page.
		//Also with the new functionality the user will be able to drag drop the file anywhere on the page.
		/*$("#dropInput").removeClass("dropAlongWithGraphConfig");
		$("#dropInput").addClass("dropAlongWithGraphTopology");
		$("#dropInput").html("Load matpower file");*/
		$("#dropInput").hide();
		
		$("#LoadSnippet").show();
		var top = (h/2);
		var left = (w/2)+100;
		$("#LoadSnippet").css({'top': top, 'left': left, 'position':'absolute', 'z-index':'100'});
	}
}
//Functions to be called at the time of loading - facilitates the handling of the events.
//Ability to support multiple formatting of the inputs - to be added.
preparePageForInteraction();