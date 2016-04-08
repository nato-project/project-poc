
// Will be used to the save the loaded JSON and CSV data
var mapData = [];
var iedData = []

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y%mmm%dd").parse;

// Variables for the visualization instances
var mapVis, timelineVis;


// Start application by loading the data
queue()
	.defer(d3.json, "data/ukraine.json")
	.defer(d3.csv, "data/map-ied-ukr-situation.csv")
	.await(function(error, mapTopoJson, iedDataCsv) {

		// Convert numeric values to 'numbers'
		iedDataCsv.forEach(function(d) {
			d.KIA = +d.KIA;
			d.WIA = +d.WIA;
			d.DATE = Date.parse(d.DATE);
		});
		iedData = iedDataCsv;

		// Copy topo json data
		mapData = mapTopoJson;

		// Create the visualizations
		createVis();

	})


function createVis() {

	// Instantiate visualization objects here
	mapVis = new Map("mapVis", iedData, mapData);
	timelineVis = new Timeline("timelineVis", iedData);

}


function brushed() {
/*
	// Set new domain if brush (user selection) is not empty
	areachart.x.domain(
			linechart.brush.empty() ? linechart.x.domain() : linechart.brush.extent()
	);
	
	// Update focus chart (detailed information)
	areachart.wrangleData();
	*/
}
