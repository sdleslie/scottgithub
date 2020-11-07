// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 1200;
var svgHeight = 600;
var minPad = .85
var maxPad = 1.07

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from forcepoints.csv
const path = "./assets/data/data.csv";

// Fetch the CSV data and console log it
d3.csv(path).then(function(healthdata) {

//get the required fields
  var has_health_care = healthdata.map(data => parseFloat(data.healthcare));
  var poverty_status = healthdata.map(data => parseFloat(data.poverty));
  var poverty_Moe = healthdata.map(data => data.povertyMoe);
  var is_smoker = healthdata.map(data => data.smokes);
  var age = healthdata.map(data => data.age);
  var income = healthdata.map(data => data.income);


  // Configure a linear scales with a ranges between the chartHeight/chartWidth and 0
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(poverty_status)*minPad, d3.max(poverty_status)*maxPad])
    .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(has_health_care)*minPad, d3.max(has_health_care)*maxPad])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Configure a line function which will plot the x and y coordinates using our scales
  var drawLine = d3.line()
    .x(data => xLinearScale(poverty_status))
    .y(data => yLinearScale(has_health_care));

    chartGroup.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
      .call(leftAxis);
  
    chartGroup.append("g")
      .attr("transform", `translate(${margin.left}, ${chartHeight})`)
      .call(bottomAxis);
  
  //   Create one SVG rectangle per piece of tvData
  //   Use the linear and band scales to position each rectangle within the chart
  
  var radius = 16
  
  chartGroup.selectAll(".stateCircle")
  .data(healthdata)
  .enter()
  .append("circle")
  .attr("class", "stateCircle")
  .attr("cx", d => xLinearScale(parseFloat(d["poverty"])))
  .attr("cy", d => yLinearScale(parseFloat(d["healthcare"])))
  .attr("r", radius)
  
chartGroup.selectAll(".stateText")
  .data(healthdata)
  .enter()
  .append('text')
  .attr("class", "stateText")
  .attr("x", d => xLinearScale(parseFloat(d["poverty"])))
  .attr("y", d => yLinearScale(parseFloat(d["healthcare"]))+5)
  .text(d => {return d.abbr})

    // Append axes titles
    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
      .classed("x-axis", true)
      .text("Poverty Rate (%)");

    chartGroup.append("text")
        .classed("y-axis", true)
        .attr("transform", "rotate(-90)")
        .attr("y",margin.left/3)
        .attr("x",-chartHeight/2 - margin.top)
        .text("Healthcare Coverage (%)");
  

});