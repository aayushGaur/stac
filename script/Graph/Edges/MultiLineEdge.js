(function(){
	// The Transformer Edge class - inherits from the Base Edge Class.	
	NETWORK.GRAPH.MultiLineEdges = function(svg, edgesData, index){	
			this.data = edgesData;
			this.conPos ={
									"con1" : {"x1":"","y1":"","x2":"","y2":""},
									"con2" : {"x1":"","y1":"","x2":"","y2":""},
									"con3" : {"x1":"","y1":"","x2":"","y2":""},
									"con4" : {"x1":"","y1":"","x2":"","y2":""},
									"maxEven":"0", "maxOdd":"0",};

			this.connectors = svg.selectAll(".edgeConnector" + index)
					.data(["1","2","3","4"])
					.enter().append("line")
					.attr("class", "edgeConnector"); 
			
			this.standardEdgesData = $.grep(edgesData, function(edgeData) {
				return (edgeData.edgeType === "Standard" && edgeData.isMultiLine === true);
			});
			this.transformerEdgesData = $.grep(edgesData, function(edgeData) {
				return (edgeData.edgeType === "Transformer" && edgeData.isMultiLine === true);;
			});
			this.lineChargeEdgesData = $.grep(edgesData, function(edgeData) {
				return (edgeData.edgeType === "LineCharge" && edgeData.isMultiLine === true);; 
			});
			
			this.standardEdges = new NETWORK.GRAPH.StandardEdges(svg,this.standardEdgesData);
			this.transformerEdges = new NETWORK.GRAPH.TransformerEdges(svg,this.transformerEdgesData);
			this.lineChargeEdges = new NETWORK.GRAPH.LineChargeEdges(svg,this.lineChargeEdgesData);
			this.decorateEdges(svg, edgesData);
	};
	NETWORK.GRAPH.MultiLineEdges.prototype = Object.create(NETWORK.GRAPH.Edges.prototype);
	NETWORK.GRAPH.MultiLineEdges.prototype.consructor = NETWORK.GRAPH.MultiLineEdges;	
	
	NETWORK.GRAPH.MultiLineEdges.prototype.decorateEdges = function(svg, edgesData) {
	};
	
	NETWORK.GRAPH.MultiLineEdges.prototype.tick = function(){
		var Obj = this;
		
		if(this.standardEdges.edges[0].length !== 0) {
			this.standardEdges.edges.each(function(d){ Obj.moveEdges(this); });
			this.standardEdges.moveDecorator();
		}
		
		if(this.transformerEdges.edges[0].length !== 0) {
			this.transformerEdges.edges.each(function(d){  Obj.moveEdges(this); });
			this.transformerEdges.moveDecorator();
		}
		
		if(this.lineChargeEdges.edges[0].length){
			this.lineChargeEdges.edges.each(function(d){ Obj.moveEdges(this); });
			this.lineChargeEdges.moveDecorator();
		}
		
		this.moveDecorator();
	};
	
	NETWORK.GRAPH.MultiLineEdges.prototype.moveDecorator = function(){
		var conData, con1, con2, con3, con4;
		conData = this.conPos;
		con1 = $((this.connectors[0])[0]);
		con2 = $((this.connectors[0])[1]);
		con3 = $((this.connectors[0])[2]);
		con4 = $((this.connectors[0])[3]);
		
		con1.attr({"x1":conData.con1.x1,"y1":conData.con1.y1,"x2":conData.con1.x2,"y2":conData.con1.y2});
		con2.attr({"x1":conData.con2.x1,"y1":conData.con2.y1,"x2":conData.con2.x2,"y2":conData.con2.y2});
		
		var posX = (parseFloat(conData.con1.x1) + parseFloat(conData.con1.x2))/2;
		var posY = (parseFloat(conData.con1.y1) + parseFloat(conData.con1.y2))/2;
		con3.attr({"x1":conData.con3.x1,"y1":conData.con3.y1,"x2":conData.con3.x2,"y2":conData.con3.y2});
		
		var posX1 = (parseFloat(conData.con2.x1) + parseFloat(conData.con2.x2))/2;
		var posY1 = (parseFloat(conData.con2.y1) + parseFloat(conData.con2.y2))/2;
		con4.attr({"x1":conData.con4.x1,"y1":conData.con4.y1,"x2":conData.con4.x2,"y2":conData.con4.y2,"conid":"4"});
	};
	
	NETWORK.GRAPH.MultiLineEdges.prototype.moveEdges = function(edgeLine){
		//FIND A BETTER WAY TO DO THIS --- AS THE __data__ IS NOT RELIABLE.
		var data = ((d3.select(edgeLine)[0])[0]).__data__;
		var edgeIndex = data.edgeName.slice(-1);
		var line, pos ={"x":"","y":""};
		var that = this;
		var rVec = {};
		rVec["x1"] = data.source.x;
		rVec["x2"] = data.target.x;
		rVec["y1"] = data.source.y;
		rVec["y2"] = data.target.y;
		
		var rotaVecST = VIEWS.SharedFunctionality.getVector(rVec.x1,rVec.y1,rVec.x2,rVec.y2);
		
		var rotaVecSTLen = Math.sqrt(rotaVecST.x * rotaVecST.x + rotaVecST.y * rotaVecST.y);
		// normalize vector
		rotaVecST.x /= rotaVecSTLen;
		rotaVecST.y /= rotaVecSTLen;
		
		if(data.source.x < data.target.x) {
			rotaVecST.x = rVec.x1 - (rotaVecST.x * (1.5 * VIEWS.SharedFunctionality.R));
			rotaVecST.y = rVec.y1 - (rotaVecST.y * (1.5 * VIEWS.SharedFunctionality.R));			
		}
		else {
			rotaVecST.x = rVec.x1 - (rotaVecST.x * (1.5 * VIEWS.SharedFunctionality.R));
			rotaVecST.y = rVec.y1 - (rotaVecST.y * (1.5 * VIEWS.SharedFunctionality.R));			
		}

		var rotaVecTS = VIEWS.SharedFunctionality.getVector(rVec.x2,rVec.y2,rVec.x1,rVec.y1);
		var rotaVecTSLen = Math.sqrt(rotaVecTS.x * rotaVecTS.x + rotaVecTS.y * rotaVecTS.y);
		// normalize vector
		rotaVecTS.x /= rotaVecTSLen;
		rotaVecTS.y /= rotaVecTSLen;
		
		if(data.source.x < data.target.x) {
			rotaVecTS.x = rVec.x2 - (rotaVecTS.x * (1.5 * VIEWS.SharedFunctionality.R));
			rotaVecTS.y = rVec.y2 - (rotaVecTS.y * (1.5 * VIEWS.SharedFunctionality.R));			
		}
		else {
			rotaVecTS.x = rVec.x2 - (rotaVecTS.x * (1.5 * VIEWS.SharedFunctionality.R));
			rotaVecTS.y = rVec.y2 - (rotaVecTS.y * (1.5 * VIEWS.SharedFunctionality.R));			
		}
		
		var vectorCalc ={};
		line = d3.select(edgeLine);
		
		vectorCalc["x1"] = rotaVecST.x;
		pos.x = rotaVecST.x;
		vectorCalc["y1"] = rotaVecST.y; 
		
		vectorCalc["x2"] = rotaVecTS.x;
		pos.y = rotaVecST.y; 
		vectorCalc["y2"] = rotaVecTS.y;
				
		var vector1 = VIEWS.SharedFunctionality.getVector(vectorCalc.x1,vectorCalc.y1,vectorCalc.x2,vectorCalc.y2);
		var vector2 = VIEWS.SharedFunctionality.getVector(vectorCalc.x2,vectorCalc.y2,vectorCalc.x1,vectorCalc.y1);
		
		var orthoVector1 = {};
		orthoVector1["x"] = vector1.y;
		orthoVector1["y"] = -vector1.x;
		 var length1 = Math.sqrt(orthoVector1.x * orthoVector1.x + orthoVector1.y * orthoVector1.y);
		// normalize vector
		orthoVector1.x /= length1;
		orthoVector1.y /= length1;
			
			
		var vector2 = VIEWS.SharedFunctionality.getVector(vectorCalc.x2,vectorCalc.y2,vectorCalc.x1,vectorCalc.y1);
		var orthoVector2 = {};
		orthoVector2["x"] = vector2.y;
		orthoVector2["y"] = (-1* vector2.x);
		 var length2 = Math.sqrt(orthoVector2.x * orthoVector2.x + orthoVector2.y * orthoVector2.y);
		// normalize vector
		
		orthoVector2.x /= length2;
		orthoVector2.y /= length2;
			 
		line.attr("x1", function (d) {
			if(edgeIndex%2 !== 0){
					d["x1"] = vectorCalc.x1 + (orthoVector1.x * VIEWS.SharedFunctionality.R/2 * edgeIndex);
			}
			else if(edgeIndex%4 === 0){
				d["x1"] = vectorCalc.x1 + (orthoVector2.x * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else if(edgeIndex%6 === 0){
				d["x1"] = vectorCalc.x1 + (orthoVector2.x * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else {
				d["x1"] = vectorCalc.x1 + (orthoVector2.x * VIEWS.SharedFunctionality.R/2 * edgeIndex/2);
			}
			return d.x1;
		})
		.attr("y1", function (d) { 
			if(edgeIndex%2 !== 0){
				d["y1"] = vectorCalc.y1 + (orthoVector1.y * VIEWS.SharedFunctionality.R/2 * edgeIndex);
			}
			else if(edgeIndex%4 === 0){
				d["y1"] = vectorCalc.y1 + (orthoVector2.y * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else if(edgeIndex%6 === 0){
				d["y1"] = vectorCalc.y1 + (orthoVector2.y * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else {
				d["y1"] = vectorCalc.y1 + (orthoVector2.y * VIEWS.SharedFunctionality.R/2 * edgeIndex/2);
			}
			
			return d.y1;
		})
		.attr("x2", function (d) { 
			if(edgeIndex%2 !== 0){
				d["x2"]  = vectorCalc.x2 + (orthoVector1.x * VIEWS.SharedFunctionality.R/2 * edgeIndex);
			}
			else if(edgeIndex%4 === 0){
				d["x2"]  = vectorCalc.x2 + (orthoVector2.x * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else if(edgeIndex%6 === 0){
				d["x2"]  = vectorCalc.x2 + (orthoVector2.x * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else {
				d["x2"]  = vectorCalc.x2 + (orthoVector2.x * VIEWS.SharedFunctionality.R/2 * edgeIndex/2);
			}
			return d.x2;
		})
		.attr("y2", function (d) { 
			if(edgeIndex%2 !== 0){
				d["y2"] =  vectorCalc.y2 + (orthoVector1.y * VIEWS.SharedFunctionality.R/2 * edgeIndex);
			}
			else if(edgeIndex%4 === 0){
				d["y2"] = vectorCalc.y2 + (orthoVector2.y * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else if(edgeIndex%6 === 0){
				d["y2"] = vectorCalc.y2 + (orthoVector2.y * VIEWS.SharedFunctionality.R/2 * (edgeIndex * 0.75));
			}
			else {
				d["y2"] = vectorCalc.y2 + (orthoVector2.y * VIEWS.SharedFunctionality.R/2 * edgeIndex/2);
			}
			return d.y2;
		}).attr("zoomPointX", function (d) { return (d.x1 + d.x2)/2;}).attr("zoomPointY", function (d) {return (d.y1 + d.y2)/2; });
		
		if(edgeIndex%2 !== 0){
			if(	edgeIndex >= this.conPos.maxOdd) {
				this.conPos.maxOdd = edgeIndex;
				this.conPos.con1.x2 = line.attr("x1");
				this.conPos.con1.y2 = line.attr("y1");
				this.conPos.con2.x2 = line.attr("x2");
				this.conPos.con2.y2 = line.attr("y2");
				
				this.conPos.con4.x1 =data.target.x;
				this.conPos.con4.y1 = data.target.y;
				
				this.conPos.con4.x2 = rotaVecTS.x;
				this.conPos.con4.y2 = rotaVecTS.y;
			}
		}
		else {
			if(edgeIndex >= this.conPos.maxEven){
				this.conPos.maxEven = edgeIndex;
				this.conPos.con1.x1 = line.attr("x1");
				this.conPos.con1.y1 = line.attr("y1");
				this.conPos.con2.x1 = line.attr("x2");
				this.conPos.con2.y1 = line.attr("y2");
				
				this.conPos.con3.x1 =rotaVecST.x;
				this.conPos.con3.y1 = rotaVecST.y;
				
				this.conPos.con3.x2 = data.source.x;
				this.conPos.con3.y2 = data.source.y;
			}
		}
	};
})(NETWORK.GRAPH || (NETWORK.GRAPH = {}));