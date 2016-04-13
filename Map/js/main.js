
// Will be used to the save the loaded JSON and CSV data
var mapData = [];
var iedData = [];
var regionData = [];

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
		console.log(mapData);

		console.log(iedData);
		// Organize region data for region coloring
		var idMap = {};
		iedData.forEach(function(d) {
			var region = d.REGION.trim(); // Remove whitespaces in some names

			var regionId = convertRegion2Id(region);

			if (idMap[regionId] == null) {
				var regionObj = {};
				regionObj.ID = regionId;
				regionObj.IEDevents = 1;
				regionObj.KIA = d.KIA;
				regionObj.WIA = d.WIA;
				idMap[regionId] = regionData.length;
				regionData.push(regionObj);
			}
			else {
				regionData[idMap[regionId]].IEDevents += 1;
				regionData[idMap[regionId]].KIA += d.KIA;
				regionData[idMap[regionId]].WIA += d.WIA;
			}
		});
		console.log(regionData);

		// Create the visualizations
		createVis();

	})


function createVis() {

	// Instantiate visualization objects here
	mapVis = new Map("mapVis", iedData, mapData, regionData);
	timelineVis = new Timeline("timelineVis", iedData);

}


function brushed() {

	// Set new domain if brush (user selection) is not empty
	mapVis.filter = timelineVis.brush.empty() ? [] : timelineVis.brush.extent();

	// Update map
	mapVis.wrangleData();
}


function regionColorSelect() {

	var selectBox = document.getElementById("regionColorSelect");
	if (mapVis.dataType != selectBox.options[selectBox.selectedIndex].value) {
		mapVis.dataType = selectBox.options[selectBox.selectedIndex].value;
		mapVis.dataLabel = selectBox.options[selectBox.selectedIndex].text;
		mapVis.updateVis();
	}
}


function convertRegion2Id(regionName) {

	var regionId = "";
	//Big switch to get region id
	switch(regionName) {
		case "CRIMEA": // 0
			regionId = "crimea";
			break;
		case "MIKOLAYIV": // 1
			regionId = "mk";
			break;
		case "MIKOLAYV": // 1
			regionId = "mk";
			break;
		case "CHERNIHIV": //2
			regionId = "cn";
			break;
		case "RIVNE": // 3
			regionId = "rv";
			break;
		case "CHERNIVTSI": // 4
			regionId = "cv";
			break;
		case "IVANO-FRANKIVSK": //5
			regionId = "if";
			break;
		// No data for 6 km
		case "LVIV": // 7
			regionId = "lviv";
			break;
		case "TERNOPOL": // 8
			regionId = "te";
			break;
		case "ZAKARPATS'KA": // 9
			regionId = "uz";
			break;
		case "VOLYN": // 10
			regionId = "volyn";
			break;
		case "CHERKASY": // 11
			regionId = "ck";
			break;
		// No data for 12 kr
		case "KIEV": // 13
			regionId = "kiev";
			break;
		case "�KIEV": // 13
			regionId = "kiev";
			break;
		case "ODESSA": // 14
			regionId = "od";
			break;
		case "VINNYTSIA": // 15
			regionId = "vn";
			break;
		case "ZHITOMYR": // 16
			regionId = "zt";
			break;
		case "ZHYTOMYR": // 16
			regionId = "zt";
			break;
		case "SUMY": // 17
			regionId = "sm";
			break;
		case "DNIPROPETROVSK": // 18
			regionId = "dp";
			break;
		case "DONETSK": // 19
			regionId = "dn";
			break;
		case "KHARKIV": // 20
			regionId = "kh";
			break;
		case "LUHANKS": // 21
			regionId = "lg";
			break;
		case "LUHANSK": // 21
			regionId = "lg";
			break;
		case "POLTAVA": // 22
			regionId = "pl";
			break;
		case "ZAPORIZHYE": // 23
			regionId = "zp";
			break;
		case "KHERSON": // 24
			regionId = "ks";
			break;
		default:
		//
	}

	return regionId;
}