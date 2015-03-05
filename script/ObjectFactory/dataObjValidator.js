//No separate namespace has been  created for the validator class as the NETWORK OBJECT should know the validation rules.
(function(){
	NETWORK.Validator = function (NetworkObjects) {
		this.networkObjects = NetworkObjects;
		this.edgeDataObjs = this.networkObjects.branchDataObj;
		this.nodeDataObjs = this.networkObjects.busDataObj;
		
		
		//Method equivalent to Protected method of the class - Used to validate the Top decorators
		this.validateTopDecorator = function (crtNode) {
			var topDecorators = crtNode.topDecorators;
			for(var index = 0; index < topDecorators.length; index++)
			{
				var topDeco = topDecorators[index], warning = false;
				var data = topDeco.topDecoData;
				//Deep Copy of the Array - JQuery method.
				var validationWarning = jQuery.extend(true, [], NETWORK.RULES.topDecoToolTip);
				
				if(topDeco.type === "generator") {
					if(parseFloat(data.costData.cost1) < 0.0 || (parseFloat(data.costData.cost2) < 0) || (parseFloat(data.costData.cost3) < 0)) {
						var cost = {"key":"Cost", "data":"Cost for generator is Negative","custom":"true","type":"warning"};
						warning = true;
						validationWarning.push(cost);
						LOGGER.addWarningMessage("Cost for generator "+ data.id +"is Negative." ,data.DOMID,"topDeco");
					}
					if(parseFloat(data.Pmin) < 0) {
						var pLB = {"key":"p LB", "data":"Value for P min is less than zero.","custom":"true","type":"warning"};
						warning = true;
						validationWarning.push(pLB);
						LOGGER.addWarningMessage("Value of P min is less than zero for generator "+ data.id + "." ,data.DOMID,"topDeco");
					}
				}
				else {
					if(parseFloat(data.costData.cost1) !== 0.0 || (parseFloat(data.costData.cost2) !== 0) || (parseFloat(data.costData.cost3) !== 0)) {
						var cost = {"key":"Cost", "data":"Synchronous Condenser has non zero cost(s).","custom":"true","type":"warning"};
						warning = true;
						validationWarning.push(cost);
						LOGGER.addWarningMessage("Cost for Synchronous Generator "+ data.id + " is Negative." ,data.DOMID,"topDeco");
					}
				}
				
				if((parseInt(data.status) === 1) && (parseInt(crtNode.status) === 0)) {
					var statusWarning = {"key":"Status", "data":"Status is 1 where as Status for Node is 0.","custom":"true","type":"warning"};
					warning = true;
					validationWarning.push(statusWarning);
					LOGGER.addWarningMessage("Status of Bus "+ crtNode.bus_i + " is 0 where as status for Generator " + data.id+ " is 1." ,data.DOMID,"topDeco");
				}
				
				if(parseFloat(data.Vg) !== parseFloat(crtNode.Vm)) {
					var VgWarning = {"key":"Vg", "data":"Value Vg on the generator is not equal to value of Vm on the bus.","custom":"true","type":"warning"};
					warning = true;
					validationWarning.push(VgWarning);
					LOGGER.addWarningMessage("Value of Vg for generator "+ data.id + "is not equal to value of Vm for bus"+ crtNode.bus_i +"." ,data.DOMID,"topDeco");
				}
				
				topDeco["validationWarning"] = validationWarning;
				topDeco["warning"] = warning;
				
				var error = false, validationError = [];
				if((parseFloat(data.Qmin) > parseFloat(data.Qmax)) || (parseFloat(data.Pmin) > parseFloat(data.Pmax))) {
					var pgBounds = {"key":"Error", "data":"Infeasible p, g bounds.","custom":"true","type":"error"};
					error = true;
					validationError.push(pgBounds);
					LOGGER.addErrorMessage("Generator " + data.id+ " has infeasible bounds." ,data.DOMID,"topDeco");
				}
				topDeco["validationError"] = validationError;
				topDeco["error"] = error;
				/*Generator Validation:
				***For Warnings***
					cost terms are negative - cost1, cost2, cost3
					p LB, below 0 - ???
					Sync cond. has non-zero cost
					status is 1, while bus status is 0
					Vg of the generator should be equal to the Vm of the node.
				***For Errors***
						infeasible p, g bounds i.e. error if Qmin > Qmax Or Pmin > Pmax
				*/
			}
		};
		
		
		/*Method equivalent to Protected method of the class - Used to validate the Bottom decorators
			***Only Warning***
			***No errors***
		*/
		this.validateBottomDecorator = function (crtNode) {
			for(var index = 0; index < crtNode.bottomDecorators.length;index++) {
				
				var data = crtNode.bottomDecorators[index], warningList=[], warning = false;
				//Deep copy of the array - for generation of the tool-tip
				var validationWarning = jQuery.extend(true, [], NETWORK.RULES.bottomDecoToolForValidation);
				if(data.Pd < 0) { 
					warning = true; 
					warningList.push("P"); 
					validationWarning.push({"key":"Status", "data":"Negative P value on Bus load.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Negative P value." ,data.DOMID,"bottomDeco");
					
				}
				if(data.Qd < 0) { 
					warning = true;
					warningList.push("Q"); 
					validationWarning.push({"key":"Status", "data":"Negative Q value on Bus load.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Negative Q value." ,data.DOMID,"bottomDeco");
				}
				if(data.Gs < 0) { warning = true; warningList.push("G"); validationWarning.push({"key":"Status", "data":"Negative G value on Bus shunt.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Negative G value." ,data.DOMID,"bottomDeco");
				}
				if(data.Bs > 0) { warning = true; warningList.push("B"); validationWarning.push({"key":"Status", "data":"Positive B value on Bus load.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Positive B value." ,data.DOMID,"bottomDeco");
				}
				
				for(var i = 0; i < validationWarning.length;i++) {
					if($.inArray(validationWarning[i].key, warningList) !== -1) {
						validationWarning[i]["classed"] = "warning";
					}
				}
				
				data["validationWarning"] = validationWarning;
				data["warning"] = warning;
			}
		};
	};
	
	NETWORK.Validator.prototype.validateEdges = function (edgesDataObj) {
		var edgesData;
		if(typeof edgesDataObj === 'undefined'){ 
			var edgesData = this.edgeDataObjs.dataObjList; 
		}
		else {
			edgesData = edgesDataObj;
		}
		
		for(var index = 0; index < edgesData.length;index++) {
			var data = edgesData[index];
			var warningList=[], warning = false, error = false;
			//Deep Copy of the Array - JQuery method.
			var validationWarning = jQuery.extend(true, [], NETWORK.RULES.edgeToolTip);
			
			if(parseFloat(data.edgeData.r) < 0) { 
				warning = true; 
				warningList.push("r");
				validationWarning.push({"key":"Status", "data":"Negative r value on Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Negative r value on Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");	
			}
			if(parseFloat(data.edgeData.x) < 0) {
				warning = true; 
				warningList.push("x"); 
				validationWarning.push({"key":"Status", "data":"Negative x value on Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Negative x value on Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");	
			}
			if(parseFloat(data.edgeData.b) < 0) { 
				warning = true;
				warningList.push("b");
				validationWarning.push({"key":"Status", "data":"Negative b value on Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Negative b value on Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");	
			}
			if(parseFloat(data.edgeData.rateA) === 0) { 
				warning = true; 
				warningList.push("Rate A"); 
				validationWarning.push({"key":"Status", "data":"RateA zero for Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Value of 'RateA' is zero for Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");
			}
			for(var i = 0; i < validationWarning.length;i++) {
				if($.inArray(validationWarning[i].key, warningList) !== -1) {
					validationWarning[i]["classed"] = "warning";
				}
			}
			
			if(parseFloat(data.edgeData.b) !== 0) {
				if(Math.abs(Math.log10(data.edgeData.x) - Math.log10(data.edgeData.b)) >= 1) {
					warning = true;
					validationWarning.push({"key":"charge", "data":"Charge is very different from x.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("On Branch - "+ data.index + " (" +(data.edgeId) + ")" + "charge is very different from x.",data.edgeData.DOMID,"edge");	
				}
			}
			
			if(parseFloat(data.edgeData.rateA) > parseFloat(data.edgeData.UB)) { 
				warning = true;
				validationWarning.push({"key":"charge", "data":"Thermal Rating is greater than the implied Upper Bound ("+ parseFloat(data.edgeData.UB).toFixed(4) + ")","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Thermal Rating is greater than the implied Upper Bound ("+ parseFloat(data.edgeData.UB).toFixed(4) + ")",data.edgeData.DOMID,"edge");
			}
			
			if((parseFloat(data.edgeData.status) === 1)  && (parseFloat(data.source.status) === 0 || parseFloat(data.target.status) === 0)) {
				warning = true;
				validationWarning.push({"key":"Mismatch Status", "data":"Branch Status 1 where as Bus status is 0.","custom":"true","type":"warning"});
				if(parseFloat(data.source.status) === 0) {
					LOGGER.addWarningMessage("Status of Branch - "+ data.index + " (" +(data.edgeId) + ")  is 1 where as status for Bus " + data.source.bus_i + " is 0.",data.edgeData.DOMID,"edge");	
				}
				else {
					LOGGER.addErrorMessage("Status of Branch - "+ data.index + " (" +(data.edgeId) + ")  is 1 where as status for Bus " + data.target.bus_i + " is 0.",data.edgeData.DOMID,"edge");	
				}
			}
			
			if(data.edgeType==="Transformer") {
				if(parseFloat(data.edgeData.b) > 0) {
					warning = true;
					validationWarning.push({"key":"Charge greater than zero.", "data":"Charge value greater than 0 for transformer.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Branch - "+ data.index + " (" +(data.edgeId) + ") is a transformer but the charge is greater than zero.",data.edgeData.DOMID,"edge");	
				}
			}
				
			this.edgeDataObjs.dataObjList[index]["validationWarning"] = validationWarning;
			this.edgeDataObjs.dataObjList[index]["warning"] = warning;
	
	
			var ValidationError=[];
			if(parseFloat(data.edgeData.rateA) < 0)  { 
				error = true; 
				ValidationError.push({"key":"Error", "data":"Thermal Limit is Negative.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Thermal Limit is Negative." ,data.edgeData.DOMID,"edge");
			}
			if(parseFloat(data.edgeData.angmin) > parseFloat(data.edgeDataangmax)) {
				error = true;
				ValidationError.push({"key":"Error", "data":"Infeasible phase angle bounds.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Infeasible Voltage Bounds." ,data.edgeData.DOMID,"edge");
			}
			
			if((parseFloat(data.source.baseKV) !== parseFloat(data.target.baseKV)) && (data.edgeType!=="Transformer")) {
				error = true;
				ValidationError.push({"key":"Error", "data":"Inconsistent KVbase values.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Inconsistent KVbase values.." ,data.edgeData.DOMID,"edge");
			}
			
			this.edgeDataObjs.dataObjList[index]["validationError"] = ValidationError;
			this.edgeDataObjs.dataObjList[index]["error"] = error;
			
		/*Edge Validation:
			***For Warning***
			r value is negative
			x value is negative
			charge value is negative - b value is negative
			Thermal rating is 0 - rateA is zero
			Thermal rating is above UB - Added UB(as per equation) during data objects itself.
			charge value is very different from x value - log equation (Range of 1 is to be taken).
			status is 1, while bus is 0 - If the bus type is 4 then it is said to be 0.
			
			***For Error***
			Thermal limit is negative - rateA <0.
			Infeasible phase angle bounds - error if angmin > angmax.
			Inconsistent KVbase values - baseKV values for the source and target are not equal.
		*/
		}
	};
	
	NETWORK.Validator.prototype.validateNode = function(nodesDataObj) {
		var nodesData;
		if(typeof nodesDataObj === 'undefined'){ 
				var nodesData = this.nodeDataObjs.dataObjList; 
		}
		else {
			nodesData = nodesDataObj;
		}
		
		for(var index = 0; index < nodesData.length;index++) {
			var crtNode = nodesData[index];
			if(crtNode.topDecorators.length > 0) {
				this.validateTopDecorator(crtNode);
			}
			else {/*Do the logging here*/}
			
			if(crtNode.bottomDecorators.length > 0) {
				this.validateBottomDecorator(crtNode);
			}
			else {/*Do the logging here*/}
			
			var erroList=[], error = false;
			
			if(crtNode.Vmin > crtNode.Vmax) {
				error = true;
				erroList.push({"key":"Error", "data":"Infeasible Voltage Bounds.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("'" + crtNode.DOMID + "' - Infeasible Voltage Bounds.",crtNode.DOMID,"node");	
			}
			crtNode["validationError"] = erroList;
			crtNode["error"] = error;
			
			/*Node Validation
				***No warnings***
				***Errors  - Infeasible voltage bounds - error if Vmin > Vmax*/
		}
	};

})(NETWORK || (NETWORK = {}));