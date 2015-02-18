// Namespace for the Network - All the other namespaces are sub namespace of this.
var NETWORK = NETWORK || {};

/** Region - Global Objects used in the Network**/
//For zoom behaviour of the graph. This is required as the Zoom In and Zoom Out buttons are required with the graph.
var zoom = d3.behavior.zoom();

//Global object for holding the cola.d3adoptor. This object is used to perform all the UI object generation, calculating positions and graph layout switching.
var myCola;

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