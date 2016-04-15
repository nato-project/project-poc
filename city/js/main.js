
// Will be used to the save the loaded CSV data
var iedData = [];
var topCityData = [];
var matrixW = 800, matrixH = 800;

// Variables for the visualization instances
var timeBarChartVis, cityBarChartVis, heatMatrixVis;
//var dsv = d3.dsv(";", "text/plain");

// Start application by loading the data
d3.csv("data/ied_data.csv", function(error, iedDataCsv) {

		// Date parser to convert strings to date objects
		var parseDate = d3.time.format("%m/%d/%Y").parse;
	
		// Convert numeric values to 'numbers'
		iedDataCsv.forEach(function(d) {
			d.kia = +d.kia;
			d.wia = +d.wia;
			d.id = +d.id;
			d.lat = parseFloat(d.lat);
			d.lng = parseFloat(d.lng);
			d.date = parseDate(d.date);
		});
		iedData = iedDataCsv;

		// Arrange data by cities
		arrangeDataByCity();
	console.log(topCityData);

		// Create the visualizations
		createVis();

	});

function arrangeDataByCity() {

	var idMap = {};
	var cityData= [];
	iedData.forEach(function(d) {
		var cityName = d.city.trim(); // Remove whitespaces in some names
		if (idMap[cityName] == null) {
			var cityObj = {};
			cityObj.ID = cityName;
			cityObj.IEDeventTotal = 1;
			var monthIndex = getMonthIndex(d.date);
			cityObj.IEDevents = new Array(24).fill(0);
			cityObj.IEDevents[monthIndex] += 1;
			idMap[cityName] = cityData.length;
			cityData.push(cityObj);
		}
		else {
			cityData[idMap[cityName]].IEDeventTotal += 1;
			var monthIndex = getMonthIndex(d.date);
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
	timeBarChartVis = new TimeBarChart("timeBarChartVis", topCityData);
	cityBarChartVis = new CityBarChart("cityBarChartVis", topCityData);
	heatMatrixVis = new HeatMatrix("heatMatrixVis", topCityData);
}
