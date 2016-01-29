//Network Solution - Only draw back of implementing it separately is that the looping happens again.
//1. No separate sub namespace has been created for the Solution as the NETWORK in one state has only one solution. - This needs to be confirmed with Dr. Carleton.
//2. Also the reason the Solution data functionality has not been added as a method in the Object Factory because Object factory must not be polluted 
//		with additional calculations (UB i.e. upper bound is an exception).

(function(){
		NETWORK.Solution = function (networkObj) {
			this.networkObj = networkObj;
			//It's important to add the solution information for the Node first as the same is required for calculating the Solution information for the Edge.
			var busCount = this.networkObj.busDataObj.dataObjList.length;
			for(var indexBus = 0; indexBus < busCount; indexBus++) {
				this.addNodeSolutionData(this.networkObj.busDataObj.dataObjList[indexBus]);
			}
			
			var branchCount = this.networkObj.branchDataObj.dataObjList.length;
			for(var branchIndex = 0; branchIndex < branchCount; branchIndex++) {
				this.addEdgeSolutionData(this.networkObj.branchDataObj.dataObjList[branchIndex]);
			}
		};

	/**
	* Adds the solution information to the Branch/edge object
	* @param	edgeObj		The edge Object for which the solution information is to be added.
	* Multiplies all the values by MVA base so as to present the data in the correct format.*/
	NETWORK.Solution.prototype.addEdgeSolutionData = function(edgeObj) {
		
		//Here mapping has been taken into consideration because often the bus IDs are not in a defined order.
		//Also the branches can be jumbled up - depending on the input.
		//Get node edge map from the NETWORK.
		var nodeIndexMap = NETWORK["nodeEdgeMap"];
		var edgeData = edgeObj.edgeData;
		var source = this.networkObj.busDataObj.dataObjList[nodeIndexMap[edgeData.fbus]];
		var target =  this.networkObj.busDataObj.dataObjList[nodeIndexMap[edgeData.tbus]];
		var solData = {};
		
		//Updated to round off the value after decimal to 4 digits.
		solData["angleDiffVal"] = parseFloat(parseFloat(source.Va) - parseFloat(target.Va)).toFixed(4);
		
		solData["angle"] = (edgeData.angle * Math.PI / 180 )
		solData["r"] = parseFloat(edgeData.r);
		if (parseFloat(edgeData.ratio) === 0.0) {
			solData["ratio"] = 1.0;
		}
		else {
			solData["ratio"] = parseFloat(edgeData.ratio);
		}
		var r = parseFloat(edgeData.r), rSquare = Math.pow(r,2), x = parseFloat(edgeData.x), xSquare = Math.pow(x,2);
		solData["b"] = -x / (rSquare + xSquare);
		solData["g"] = r / (rSquare + xSquare);
		
		
		//Calculating p[i,j] one line at a time - this would be made a single statement once the values are confirmed with Dr. Carleton.
		//		p[i,j] = g[i,j]*(Vm[i]/ratio[i,j])^2 
		var a1 = parseFloat(solData.g) * Math.pow((parseFloat(source.Vm)/parseFloat(solData.ratio)),2);
		
		//	  - g[i,j]*Vm[i]/ratio[i,j]*Vm	[j]*cos(Va[i]-Va[j]-angle[i,j])
		var a2 = parseFloat(solData.g) * (parseFloat(source.Vm)/parseFloat(solData.ratio)) * parseFloat(target.Vm) * Math.cos(source.solData.Va - target.solData.Va - solData.angle);
			
		//	  - b[i,j]*Vm[i]/ratio[i,j]*Vm[j]*sin(Va[i]-Va[j]-angle[i,j])
		var a3 = parseFloat(solData.b) * parseFloat(source.Vm) / parseFloat(solData.ratio) * parseFloat(target.Vm) * Math.sin(source.solData.Va - target.solData.Va - solData.angle);
		solData["p-s-t"] = ((a1 - a2 - a3) * parseFloat(NETWORK_OBJECTS.BaseMVA)).toFixed(4);
		
		
		//Calculating q[i,j] one line aMatht a time - this would be made a single statement once the values are confirmed with Dr. Carleton.
		//		q[i,j] = -(charge[i,j]/2+b[i,j])*(Vm[i]/ratio[i,j])^2 
		var b1 = (parseFloat(edgeData.b)/2 + solData.b) * Math.pow((parseFloat(source.Vm) / parseFloat(solData.ratio)),2);
		
		//		+ b[i,j]*Vm[i]/ratio[i,j]*Vm[j]*cos(Va[i]-Va[j]-angle[i,j])
		var b2 = solData.b * (source.Vm/solData.ratio) * target.Vm * Math.cos(source.solData.Va - target.solData.Va - solData.angle);
		
		//- g[i,j]*Vm[i]/ratio[i,j]*Vm[j]*sin(Va[i]-Va[j]-angle[i,j]);
		var b3 = solData.g * (parseFloat(source.Vm)/solData.ratio) * target.Vm * Math.sin(source.solData.Va - target.solData.Va - solData.angle);
		solData["q-s-t"] = ((-b1 + b2 - b3) * parseFloat(NETWORK_OBJECTS.BaseMVA)).toFixed(4);
		
		
		//Calculating p[j,i] one line at a time - this would be made a single statement once the values are confirmed with Dr. Carleton.
		//		p[j,i] = g[i,j]*Vm[j]^2 
		var c1 = solData.g * Math.pow(parseFloat(target.Vm),2);
		
		// 	 - g[i,j]*Vm[i]*Vm[j]/ratio[i,j]*cos(Va[j]-Va[i]+angle[i,j])
		var c2 = solData.g * source.Vm * (target.Vm / solData.ratio) * Math.cos(target.solData.Va - source.solData.Va + solData.angle);
		
		//	 - b[i,j]*Vm[i]*Vm[j]/ratio[i,j]*sin(Va[j]-Va[i]+angle[i,j]);
		var c3 = solData.b * parseFloat(source.Vm) * (parseFloat(target.Vm)/solData.ratio) * Math.sin(target.solData.Va - source.solData.Va + solData.angle);
		solData["p-t-s"] = ((c1 - c2 - c3) * parseFloat(NETWORK_OBJECTS.BaseMVA)).toFixed(4);
		
		
		//Calculating q[j,i] one line at a time - this would be made a single statement once the values are confirmed with Dr. Carleton.
		//q[j,i] = -(charge[i,j]/2+b[i,j])*Vm[j]^2 
		var d1 = (edgeData.b/2 + solData.b) * Math.pow(target.Vm,2);
		
		//		+ b[i,j]*Vm[i]*Vm[j]/ratio[i,j]*cos(Va[j]-Va[i]+angle[i,j])
		var d2 = solData.b * source.Vm * (target.Vm/solData.ratio) *  Math.cos(target.solData.Va - source.solData.Va + solData.angle);
		
		//		- g[i,j]*Vm[i]*Vm[j]/ratio[i,j]*sin(Va[j]-Va[i]+angle[i,j]);
		var d3 = solData.g * source.Vm * (target.Vm/solData.ratio) * Math.sin(target.solData.Va - source.solData.Va + solData.angle);
		solData["q-t-s"] =  ((-d1 + d2 - d3) * parseFloat(NETWORK_OBJECTS.BaseMVA)).toFixed(4);

		
		//s[i,j] = sqrt(p[i,j]^2 + q[i,j]^2)
		solData["s-s-t"] = Math.sqrt(Math.pow(solData["p-s-t"],2) + Math.pow(solData["q-s-t"],2)).toFixed(4);
		
		//s[j,i] = sqrt(p[j,i]^2 + q[j,i]^2)
		solData["s-t-s"] = Math.sqrt(Math.pow(solData["p-t-s"],2) + Math.pow(solData["q-t-s"],2)).toFixed(4);
		
		edgeObj["solutionData"] = solData;
		
		/*p[i,j] = g[i,j]*(Vm[i]/ratio[i,j])^2 
			  - g[i,j]*Vm[i]/ratio[i,j]*Vm[j]*cos(Va[i]-Va[j]-angle[i,j])
			  - b[i,j]*Vm[i]/ratio[i,j]*Vm[j]*sin(Va[i]-Va[j]-angle[i,j])

		q[i,j] = -(charge[i,j]/2+b[i,j])*(Vm[i]/ratio[i,j])^2 
			+ b[i,j]*Vm[i]/ratio[i,j]*Vm[j]*cos(Va[i]-Va[j]-angle[i,j])
			- g[i,j]*Vm[i]/ratio[i,j]*Vm[j]*sin(Va[i]-Va[j]-angle[i,j]);


		p[j,i] = g[i,j]*Vm[j]^2 
			 - g[i,j]*Vm[i]*Vm[j]/ratio[i,j]*cos(Va[j]-Va[i]+angle[i,j])
			 - b[i,j]*Vm[i]*Vm[j]/ratio[i,j]*sin(Va[j]-Va[i]+angle[i,j]);

		q[j,i] = -(charge[i,j]/2+b[i,j])*Vm[j]^2 
			+ b[i,j]*Vm[i]*Vm[j]/ratio[i,j]*cos(Va[j]-Va[i]+angle[i,j])
			- g[i,j]*Vm[i]*Vm[j]/ratio[i,j]*sin(Va[j]-Va[i]+angle[i,j]);
			
		The value of s[i,j] and s[j,i] are also interesting, but these are very easy to compute once you have p and q.
		s[i,j] = sqrt(p[i,j]^2 + q[i,j]^2)
		s[j,i] = sqrt(p[j,i]^2 + q[j,i]^2)*/
	};
	
	/**
	* Adds the solution information to the Bus/Node Object passed.
	* @param	nodeObj		The node Object for which the solution information is to be added.*/
	NETWORK.Solution.prototype.addNodeSolutionData = function(nodeObj) {
		var solData = {};
		var vaSol = (nodeObj.Va * Math.PI / 180);
		solData["Va"] = vaSol;
		nodeObj["solData"] = solData;
		
		//Va[i] = Va[i]*pi/180  - convert bus phase angles to radians
	};
})(NETWORK || (NETWORK = {}));