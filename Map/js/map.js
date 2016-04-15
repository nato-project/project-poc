/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _iedData			-- the ied data
 * @param _mapData			-- the map data
 * @param _regionData			-- the map regions data
 */

Map = function(_parentElement, _iedData, _mapData, _regionData){
    this.parentElement = _parentElement;
    this.iedData = _iedData;
    this.mapData = _mapData;
    this.regionData = _regionData;
    this.displayData = []; // see data wrangling
    this.filter = [];

    // For region color
    this.dataType = "IEDevents";
    this.dataLabel = "Nb IED Incidents";

    this.initVis();
}

/*
 * Initialize area chart with brushing component
 */

Map.prototype.initVis = function(){
    var vis = this; // read about the this

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

    vis.width = 900 - vis.margin.left - vis.margin.right,
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Set type and color scales
    vis.colors = d3.scale.quantize().domain([0,1]).range(colorbrewer.Blues[7]);
    vis.typeScale = d3.scale.linear().range([0,1]);

    // Legend data
    var legendColors = vis.colors.range();
    var legendValues = [0];
    vis.colors.range().forEach(function(d,i) {
        legendValues.push(Math.round(vis.typeScale.invert(vis.colors.invertExtent(d)[1])));
    });
    legendValues.push("No data");
    legendColors.push("lightgrey");
    var side = 20;

    // Create legend
    var legend = vis.svg.append("g")
        .attr("transform", "translate(150, 390)")
        .attr("id", "legend");

    // Legend title
    legend.append("text")
        .attr("text-anchor","end")
        .attr("id","legendTitle")
        .attr("transform", "translate(30,0)");

    // Add color squares
    legend.append("g").selectAll("rect")
        .data(legendColors)
        .enter()
        .append("rect")
        .attr("class", "legendColor")
        .attr("fill", function (d) {return d;})
        .attr("height", side)
        .attr("width", side)
        .attr("transform", function(d, i) {
            return "translate(2," + (i*(side+3) + 20) +")";
        });

    // Add values
    legend.append("g").selectAll("text")
        .data(legendValues)
        .enter()
        .append("text")
        .attr("class", "legendValue")
        .attr("text-anchor","end")
        .attr("transform", function(d, i) {
            if (i==8) return "translate(0," + (i*(side+3)+15) +")";
            return "translate(0," + (i*(side+3) + 20) +")";
        });

    // Create projection
    var projection = d3.geo.mercator().scale([2650]).center([32, 49.4]);
    vis.proj = projection;

    // Create D3 geo path
    var path = d3.geo.path().projection(projection);

    // Convert TopoJSON to GeoJSON
    var countries = topojson.feature(mapData, mapData.objects.countries).features;
    var regions = topojson.feature(mapData, mapData.objects.regions).features;

    // Map TopoJSON data to the screen
    // Regions
    regionsG = vis.svg.append("g");
    regionsG.selectAll("path")
        .data(regions)
        .enter().append("path")
        .attr("class", "country")
        .attr("id", function(d) { return d.id;})
        .attr("d", path)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("fill", "lightgrey");

    // Create circles group
    vis.circlesG = vis.svg.append("g");

    // Add random translations to IED data to avoid perfect overlap
    vis.iedData.forEach(function(d) {
    	// Ramdomly spread it around the center point up to 4 pixels
    	d.tx = 8*(Math.random()-0.5);
    	d.ty = 8*(Math.random()-0.5);
    });
    
    // Wrangle and update
    vis.wrangleData();

}

Map.prototype.wrangleData = function() {

    var vis = this; // read about the this

    // Filter with timeline
    vis.displayData = vis.iedData;
    if (vis.filter.length > 0) {
        vis.displayData = vis.iedData.filter(function (d) {
            var first = new Date(d.date) >= vis.filter[0];
            var second = new Date(d.date) <= vis.filter[1];
            return first && second;
        });
    }

    // Update the visualization
    vis.updateVis();

}

Map.prototype.updateVis = function() {

    var vis = this; // read about the this

    // Update scale
    var maxValue = d3.max(regionData, function(d) {return d[vis.dataType];});
    vis.typeScale.domain([0, maxValue]);

    // Colors
    vis.svg.selectAll("path")
        .style("fill",function(d) {
            // Color
            var data;
            regionData.forEach(function(r) {
                if (r.region_id == d.id) data = r;
            });
            if (data) {
                var value = data[vis.dataType];
                if (isNaN(value)) return "lightgrey";
                return vis.colors(vis.typeScale(value));
            }
            else return "lightgrey";
        });

    // Update legend
    vis.svg.select("#legendTitle").text(vis.dataLabel);
    var legendValues = [0];
    vis.colors.range().forEach(function(d,i) {
        legendValues.push(Math.round(vis.typeScale.invert(vis.colors.invertExtent(d)[1])));
    });
    legendValues[legendValues.length-1] = "No data";
    var entries = vis.svg.selectAll(".legendValue")
        .data(legendValues)
        .text(function (d) {return d;});

    // Add event circles
    var circ = vis.circlesG.selectAll("circle")
        .data(vis.displayData);

    // Enter
    circ.enter().append("circle")
        .attr("class", "iedEventCircle");

    // Update
    circ.attr("id", function(d) { return d.id;})
        .attr("cx", function(d) {
        	return d.tx + vis.proj([d.lng, d.lat])[0];})
        .attr("cy", function(d) {
        	return d.ty + vis.proj([d.lng, d.lat])[1];})
        .attr("r", 4)
        .attr("fill",function(d) {
            if (d.kia > 0) return "red";
            if (d.wia > 0) return "orange";
            return "grey";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("opacity", 1);

    // Exit
    circ.exit().remove();
}