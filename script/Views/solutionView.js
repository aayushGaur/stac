//The Validation View has been implemented with a static functionality because it is only used to update of the UI of the network and an object of the same is not required.
VIEWS.SolutionView  = (function(){
	return {
		bSolutionView:false,
		displayView : function() {
				console.log("Solution View not implemented as yet. For the Developer - Please check display view actual as that function needs to be updated for the implementation of this.");
		},

		//This methods needs to be updated correctly.
		/*displayViewActual : function() {
			if(!VIEWS.SolutionView.viewMe) {
				VIEWS.SolutionView.viewMe = true;
				d3.selectAll(".edge").each(function (d) {d3.select(this).attr("display", "none") });
				
					this.SolEdges = d3.select("g").selectAll(".solEdges").data(NETWORK_OBJECTS.branchDataObj.dataObjList).enter().insert("path", ":first-child").attr("class", "soledge").attr("fill","green")
									.attr("d", function(d){ return VIEWS.SolutionView.drawCurve(d); })
									.classed("OffStatus", function(d) { if(parseInt(d.edgeData.status) === 0) { return true; }	})
				
				d3.selectAll(".node").each(function(d){ d.fixed |= 16;});
			}
			else {
				VIEWS.SolutionView.viewMe = false;
			}
		},
		
		drawCurve : function(d){
		var slope = Math.atan2((+d.target.y - d.source.y), (+ d.target.x - d.source.x));
		var slopePlus90 = Math.atan2((+d.target.y - d.source.y), (+d.target.x - d.source.x)) + (Math.PI/2);

		var sourceX = +d.source.x;
		var sourceY = +d.source.y;
		var targetX = +d.target.x;
		var targetY = +d.target.y;
		
		
		if(sourceX > targetX) {
			sourceX = +d.source.x - VIEWS.SharedFunctionality.R;
			var targetX = +d.target.x + VIEWS.SharedFunctionality.R;
		}
		else {
			sourceX = +d.source.x + VIEWS.SharedFunctionality.R;
			sourceX = +d.source.x - VIEWS.SharedFunctionality.R;
		}
		
		if(sourceY > targetY) {
			sourceY = +d.source.y - VIEWS.SharedFunctionality.R;
			var targetY = +d.target.y + VIEWS.SharedFunctionality.R;
		}
		else {
			sourceY = +d.source.y + VIEWS.SharedFunctionality.R;
			sourceY = +d.source.y - VIEWS.SharedFunctionality.R;
		}
		var points = [];
		var strength_scale = d3.scale.linear()
			.range([2, 10]) /* thickness range for flow lines 
			.domain([0, 10]);
		
		var d3LineLinear = d3.svg.line().interpolate("linear");	
		var radius = VIEWS.SharedFunctionality.R;
		points.push([sourceX - VIEWS.SharedFunctionality.R * Math.cos(slope) - strength_scale(3) * Math.cos(slopePlus90), 
		sourceY - radius*Math.sin(slope) - strength_scale(3) * Math.sin(slopePlus90)]);

		var bothDirections = -1;

		$.each(links, function(index, value) {
			if(value.source == d.target && value.target == d.source) {
			  bothDirections = index;
			  return false;
			}
		});

		if(bothDirections >= 0) {
			points.push([targetX + radius*Math.cos(slope) + (strength_scale(links[bothDirections].strength)+1) * Math.cos(slopePlus90), targetY + radius*Math.sin(slope) + (strength_scale(links[bothDirections].strength)+1) * Math.sin(slopePlus90)]);
		} else {
			points.push([targetX  + radius * Math.cos(slope), targetY + radius * Math.sin(slope)]);
		}
  
		points.push([sourceX - radius*Math.cos(slope) + strength_scale(3) * Math.cos(slopePlus90), sourceY - radius*Math.sin(slope) + strength_scale(3) * Math.sin(slopePlus90)]);
		console.log(points);
		return d3LineLinear(points) + "Z";
		
		},*/
	}
})();