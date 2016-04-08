
/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the ied data
 */

Timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.data = _data;

	this.initVis();
}


/*
 * Initialize timeline chart with brushing component
 */

Timeline.prototype.initVis = function(){
	var vis = this; // read about the this

	vis.margin = {top: 10, right: 10, bottom: 30, left: 30};

	vis.width = 800 - vis.margin.left - vis.margin.right,
	vis.height = 100 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales and axes
	vis.x = d3.time.scale()
	  	.range([0, vis.width])
	  	.domain(d3.extent(vis.data, function(d) {return d.DATE;}));

	vis.y = d3.scale.linear()
			.range([vis.height, 0])
			.domain([0, d3.max(vis.data, function(d) {return d.KIA + d.WIA;})]);

	vis.xAxis = d3.svg.axis()
		  .scale(vis.x)
		  .orient("bottom");

	// Create svg elements
	vis.svg.append("g")
		.selectAll("circle")
		.data(vis.data)
		.enter().append("circle")
		.attr("cx", function(d) {
			if (d.DATE) return vis.x(d.DATE);})
		.attr("cy", function(d) {return vis.y(d.KIA + d.WIA);})
		.attr("r", 5)
		.attr("fill",function(d) {
			if (d.KIA > 0) return "black";
			if (d.WIA > 0) return "#888888";
			return "lightgrey";
		});

	// Initialize brush component
	vis.brush = d3.svg.brush()
		.x(vis.x)
		.on("brush", brushed);

	// Append brush component
	vis.svg.append("g")
		.attr("class", "x brush")
		.call(vis.brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", vis.height + 7);

  vis.svg.append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(vis.xAxis);
}

