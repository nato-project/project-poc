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
    this.filter = [];

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
    vis.proj = projection;

    // Create D3 geo path
    var path = d3.geo.path().projection(projection);

    // Convert TopoJSON to GeoJSON
    var countries = topojson.feature(mapData, mapData.objects.countries).features;
    var regions = topojson.feature(mapData, mapData.objects.regions).features;
    vis.regionData = regions;

    // Map TopoJSON data to the screen
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
        .style("fill", "lightgrey");

    // Create circles group
    vis.circlesG = vis.svg.append("g");

    // Wrangle and update
    vis.wrangleData();

}

Map.prototype.wrangleData = function() {

    var vis = this; // read about the this

    // Filter with timeline later
    vis.displayData = vis.iedData;

    if (vis.filter.length > 0) {
        vis.displayData = vis.iedData.filter(function (d) {
            var first = new Date(d.DATE) >= vis.filter[0];
            var second = new Date(d.DATE) <= vis.filter[1];
            return first && second;
        });
    }

    // Update the visualization
    vis.updateVis();

}

Map.prototype.updateVis = function() {

    var vis = this; // read about the this

    // Add event circles
    var circ = vis.circlesG.selectAll("circle")
        .data(vis.displayData);

    // Enter
    circ.enter().append("circle")
        .attr("class", "iedEventCircle");

    // Update
    circ.attr("id", function(d) { return d.ID;})
        .attr("cx", function(d) {return vis.proj([d.LOCATION_LNG, d.LOCATION_LAT])[0];})
        .attr("cy", function(d) {return vis.proj([d.LOCATION_LNG, d.LOCATION_LAT])[1];})
        .attr("r", 10)
        .attr("fill",function(d) {
            if (d.KIA > 0) return "red";
            if (d.WIA > 0) return "orange";
            return "grey";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("opacity",0.2);

    // Exit
    circ.exit().remove();
}