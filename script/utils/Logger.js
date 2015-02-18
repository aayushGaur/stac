//THIS CLASS is RESPONSIBLE FOR LOGGING AND HANDLING THE WARNINGS AND THE ERRORS.

//THE METHODS CURRENTLY IMPLEMENTED WILL BE UPDATED i.e. made template driven or tree view driven - AFTER THE DISCUSSION - 08/02/2015
(function(){
	NETWORK.Logger = function(svg, edgesmessage){
		this.errorMessages = [];
		this.warningMessages = [];
	};
	
	/**
	*	Adds the Error Messages to the array object with the Logger Object and adds the error message to the '#ErrorLogs' div.
	*	@param	message		The error message to be added to the Error div.
	*	@param	redDOMID		The DOMID of the element for which the error message has been logged.
	*	@param	eleType			The type of the element for which the error message has been logged. (This parameter has been kept for adding the functionality in the solution view).
	**/
	NETWORK.Logger.prototype.addErrorMessage = function(message,refDOMID,eleType) {
		var em = {value:message,eleID:refDOMID,eleType:eleType};
		this.errorMessages.push(em);
		$("<div class='loggedErrors' refDOMID=" + refDOMID +">" + message + "</div>").on("click", function() {
			VIEWS.SharedFunctionality.zoomOnElement(this.getAttribute("refDOMID"));
		}).appendTo('#ErrorLogs');
	};
	
	NETWORK.Logger.prototype.addWarningMessage = function(message,refDOMID,eleType) {
		var em = {value:message,eleID:refDOMID,eleType:eleType};
		this.warningMessages.push(em);
		$("<div class='loggedWarnings' refDOMID=" + refDOMID +">" + message + "</div>").on("click", function() {
			VIEWS.SharedFunctionality.zoomOnElement(this.getAttribute("refDOMID"));
		}).appendTo('#WarningLogs');
	};
	
	/**
	*	Does the Garbage collection for the Logger object. (This is required because the LOGGER object needs to be created once and the same object is used with new values when a new file is loaded).
	*	Performs the following action:
	*	1. Clears the arrays the hold the errors and the warnings for the Logger Object.
	*	2. Clears the DIVs holding the errors and warnings.
	*	3. Hides the LogErrorsWarnings DIV from the screen.
	**/
	NETWORK.Logger.prototype.collectGarbage = function() {
		this.errorMessages = [];
		this.warningMessages = [];
		$("#ErrorLogs").html("<div>Errors:</div>");
		$("#WarningLogs").html("<div>Warnings:</div>");
		$("#LogErrorsWarnings").hide();
	};
	
	NETWORK.Logger.prototype.toggleErrorsAndWarnings = function(showEW) {
		if(showEW) {
			if(this.errorMessages.length === 0) {
				$('#ErrorLogs').hide();
			}
			else {
				$('#ErrorLogs').show();
				$("#LogErrorsWarnings").show();
			}
			
			if(this.warningMessages.length === 0) {
				$('#WarningLogs').hide();
			}
			else {
				$('#WarningLogs').show();
				$("#LogErrorsWarnings").show();
			}
		}
		else {
			$("#LogErrorsWarnings").hide();
		}
	};
})(NETWORK || (NETWORK = {}));

//Setting the global logging object.
LOGGER = new NETWORK.Logger();