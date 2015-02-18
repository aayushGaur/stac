//String literal used to define the beginning and ending of the objects in the input file stored as object.
NETWORK.RULES = {
	parser : {
		ObjectIdentifiers : {
			BeginningData: {
				"AreaData" : "%% area data",
				"BusData" : "%% bus data",
				"GeneratorData" : "%% generator data",
				"GeneratorCostData" : "%% generator cost data",
				"BranchData" : "%% branch data",
				"BusLocation" : "%% bus location",
				"BaseMVA" : "mpc.baseMVA = "
			},
			EndingData: {
				"AreaData" : "];",
				"BusData" : "];",
				"GeneratorData" : "];",
				"GeneratorCostData" : "];",
				"BranchData" : "];",
				"BusLocation" : "];",
				"BaseMVA" : ";"
			}
		}
	},
//NOTE  - THE FIRST RULE IN ALL THE TOOL-TIP DATA MUST BE THE TOOLTIP TITLE - AS THE TITLE IS THE FIRST ELEMENT IN A STRUCTURE IT MUST BE KEPT IN THE FIRST POSITION IN THE DS ALSO.
		
	nodeToolTip : [
		{"key":"ToolTipTitle", "data":"bus_i","units":"-NA-","preTitleValText":"Bus ","postTitleValText":""},
		{"key":"Id", "data":"bus_i","units":"-NA-"},
		{"key":"V Max", "data":"Vmax","units":"Volts p.u."},
		{"key":"V Min", "data":"Vmin","units":"Volts p.u."},
		{"key":"Voltage", "data":"Vm","units":"Volts p.u."},
		{"key":"Phase Angle", "data":"Va","units":"Degree"},
		{"key":"Base KV", "data":"baseKV","units":"KV"},
		{"key":"Generator Id(s) List", "data":"GenIdList","units":"-NA-"},
	],
	
	bottomDecoToolTipLoad : [
		{"key":"ToolTipTitle", "data":"bus_i","units":"-NA-","preTitleValText":"Loads on Bus ","postTitleValText":""},
		{"key":"P", "data":"Pd","units":"MW"},
		{"key":"Q", "data":"Qd","units":"MVAr"},
	],
	
	bottomDecoToolTipShunt : [
		{"key":"ToolTipTitle", "data":"bus_i","units":"-NA-","preTitleValText":"Loads on Bus ","postTitleValText":""},
		{"key":"G", "data":"Gs","units":"MW demanded at V = 1.0 p.u."},
		{"key":"B", "data":"Bs","units":"MVAr injected at V = 1.0 p.u."},
	],
	
	bottomDecoToolForValidation : [
		{"key":"ToolTipTitle", "data":"bus_i","units":"-NA-","preTitleValText":"Loads on Bus ","postTitleValText":""},
		{"key":"P", "data":"Pd","units":"MW"},
		{"key":"Q", "data":"Qd","units":"MVAr"},
		{"key":"G", "data":"Gs","units":"MW demanded at V = 1.0 p.u."},
		{"key":"B", "data":"Bs","units":"MVAr injected at V = 1.0 p.u."},
	],
	
	topDecoToolTip : [
		{"key":"ToolTipTitle", "data":"id","units":"-NA-","preTitleValText":"Generator ","postTitleValText":""},
		{"key":"Bus Id", "data":"bus","units":"-NA-"},
		{"key":"P", "data":"Pg","units":"MW"},
		{"key":"P Min Bounds", "data":"Pmin","units":"MW"},
		{"key":"P Max Bounds", "data":"Pmax","units":"MW"},
		{"key":"Q", "data":"Qg","units":"MVAr"},
		{"key":"Q Min Bounds", "data":"Qmin","units":"MVAr"},
		{"key":"Q Max Bounds", "data":"Qmax","units":"MVAr"},
		{"key":"Cost 1", "data":"costData.cost1","units":"$/MW hr squared"},
		{"key":"Cost 2", "data":"costData.cost2","units":"$/MW hr"},
		{"key":"Cost 3", "data":"costData.cost3","units":"$/MW hr"},
	],
	
	edgeToolTip : [
		{"key":"ToolTipTitle", "data":"edgeId","units":"-NA-","preTitleValText":"Line ","postTitleValText":""},
		{"key":"Id", "data":"index","units":"-NA-"},
		{"key":"r", "data":"edgeData.r","units":"Resistance p.u."},
		{"key":"x", "data":"edgeData.x","units":"Reactance p.u."},
		/*{"key":"g", "custom":" d.linkData.r/(d.linkData.r*d.linkData.r + d.linkData.x*d.linkData.x)	"},
		{"key":"b", "data":"-x/(r^2 + x^2)"},*/
		{"key":"charge", "data":"edgeData.b","units":"Susceptance p.u."},
		{"key":"Rate A", "data":"edgeData.rateA","units":"MVA"},
		{"key":"Rate B", "data":"edgeData.rateB","units":"MVA"},
		{"key":"Rate C", "data":"edgeData.rateC","units":"MVA"},
		{"key":"Min angle difference", "data":"edgeData.angmin","units":"Degrees"},
		{"key":"Max angle difference", "data":"edgeData.angmax","units":"Degrees"},
	],
	transformerEdgeToolTipExtra : [
		{"key":"Transformer Tap", "data":"edgeData.ratio","units":"Volts p.u."},
		{"key":"Phase Shift", "data":"edgeData.angle","units":"Degrees"},
	],
};

NETWORK.ERRORS = {
};

NETWORK.WARNINGS = {
	lineWarnings : [
		{"wID":"LINE.WARNING.R", "template":"1","eleId":"","attrName":"","domEleID":""},
		/*{"key":"Bus Id", "data":"bus","units":"-NA-"},
		{"key":"P", "data":"Pd","units":"MW"},
		{"key":"P Min Bounds", "data":"Pmin","units":"MW"},
		{"key":"P Max Bounds", "data":"Pmax","units":"MW"},
		{"key":"Q", "data":"Qd","units":"MVAr"},
		{"key":"Q Min Bounds", "data":"Qmin","units":"MVAr"},
		{"key":"Q Max Bounds", "data":"Qmax","units":"MVAr"},
		{"key":"Cost 1", "data":"costData.cost1","units":"$/MW hr squared"},
		{"key":"Cost 2", "data":"costData.cost2","units":"$/MW hr"},
		{"key":"Cost 3", "data":"costData.cost3","units":"$/MW hr"},
		
		/*r value is negative
		x value is negative
		charge value is negative
		Thermal rating is 0
		Thermal rating is above UB
		charge value is very different from x value
		status is 1, while bus is 0*/
	],
};

NETWORK.LOGGING = {
	TEMPLATES : [
		{"id":"1","text":"The Value of '%attrName%', for the element '%eleId%' is 'less than zero'."},
		{"id":"2","text":"The Value of '%attrName%', for the element '%eleId%' is 'greater than zero'."},
	],
};