
// Will be used to the save the loaded JSON and CSV data
var mapData = [];
var iedData = []

// Variables for the visualization instances
var mapVis, timelineVis;
var dsv = d3.dsv(";", "text/plain");

// Start application by loading the data
queue()
	.defer(d3.json, "data/ukraine.json")
	.defer(dsv, "data/IED Map Data - All.csv")
	.await(function(error, mapTopoJson, iedDataCsv) {

		// Date parser to convert strings to date objects
		var parseDate = d3.time.format("%d/%m/%Y").parse;

		// Convert numeric values to 'numbers'
		iedDataCsv.forEach(function(d) {
			d.KIA = +d.KIA;
			d.WIA = +d.WIA;
			d.ID = +d.ID;
			d.LOCATION_LAT = parseFloat(d.LOCATION_LAT.replace(',','.'));
			d.LOCATION_LNG = parseFloat(d.LOCATION_LNG.replace(',','.'));
			d.DATE = parseDate(d.DATE);
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

	// Set new domain if brush (user selection) is not empty
	mapVis.filter = timelineVis.brush.empty() ? [] : timelineVis.brush.extent();

	// Update map
	mapVis.wrangleData();
}
