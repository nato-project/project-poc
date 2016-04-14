
// Will be used to the save the loaded CSV data
var iedData = [];
var topCityData = [];
var matrixW = 800, matrixH = 800;

// Variables for the visualization instances
var timeBarChartVis, cityBarChartVis, heatMatrixVis;
var dsv = d3.dsv(";", "text/plain");

// Start application by loading the data
// Load CSV file
var mapVis, timelineVis;
var dsv = d3.dsv(";", "text/plain");

// Start application by loading the data
dsv("data/IED Map Data - All.csv", function(error, iedDataCsv) {

		// Date parser to convert strings to date objects
		var parseDate = d3.time.format("%d/%m/%Y").parse;
	console.log(iedDataCsv);
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

		// Arrange data by cities
		arrangeDataByCity();
	console.log(topCityData);

		// Create the visualizations
		createVis();

	})


function arrangeDataByCity() {

	var idMap = {};
	var cityData= [];
	iedData.forEach(function(d) {
		var cityName = d.CITY.trim(); // Remove whitespaces in some names
		if (idMap[cityName] == null) {
			var cityObj = {};
			cityObj.ID = cityName;
			cityObj.IEDeventTotal = 1;
			var monthIndex = getMonthIndex(d.DATE);
			cityObj.IEDevents = new Array(24).fill(0);
			cityObj.IEDevents[monthIndex] += 1;
			idMap[cityName] = cityData.length;
			cityData.push(cityObj);
		}
		else {
			cityData[idMap[cityName]].IEDeventTotal += 1;
			var monthIndex = getMonthIndex(d.DATE);
			cityData[idMap[cityName]].IEDevents[monthIndex] += 1;
		}
	});

	delete idMap; // Next op makes it out of synch

	// Sort cities
	var sortedCityData = cityData.sort(function(a,b) {return b.IEDeventTotal- a.IEDeventTotal;});

	// Keep top cities
	topCityData = sortedCityData.slice(0, 50);

}


function getMonthIndex(date) {
	// 01-11 for 2014, 12-23 for 2015
	var monthIndex = date.getMonth();
	if (date.getYear() == 115) monthIndex += 12;
	return monthIndex;
}


function createVis() {


	// Instantiate visualization objects here
	//timeBarChartVis, cityBarChartVis, heatMatrixVis;
	timeBarChartVis = new TimeBarChart("timeBarChartVis", topCityData);
	cityBarChartVis = new CityBarChart("cityBarChartVis", topCityData);
	heatMatrixVis = new HeatMatrix("heatMatrixVis", topCityData);

}
