/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _iedData			-- the ied data
 * @param _mapData			-- the map data
 */

Map = function(_parentElement, _iedData, _mapData){
    this.parentElement = _parentElement;
    this.iedData = _iedData;
    this.mapData = _mapData;
    this.displayData = []; // see data wrangling
    this.filter = "";

    this.initVis();
}

/*
 * Initialize area chart with brushing component
 */

Map.prototype.initVis = function(){
    var vis = this; // read about the this

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

    vis.width = 800 - vis.margin.left - vis.margin.right,
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Create projection
    var projection = d3.geo.mercator().scale([2200]).center([33.35, 49.5]);

    // Create D3 geo path
    var path = d3.geo.path().projection(projection);

    console.log(mapData);

    // Convert TopoJSON to GeoJSON
    var countries = topojson.feature(mapData, mapData.objects.countries).features;
    var regions = topojson.feature(mapData, mapData.objects.regions).features;

    console.log(countries);

    // Map TopoJSON data to the screen
    // Countries
    vis.svg.append("g")
        .selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("id", function(d) { return d.properties.name;})
        .attr("d", path)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("fill", "lightgrey");
    // Regions
    regionsG = vis.svg.append("g");
    regionsG.selectAll("path")
        .data(regions)
        .enter().append("path")
        .attr("class", "country")
        .attr("id", function(d) { return d.properties.name;})
        .attr("d", path)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("fill", "darkgrey");

}
