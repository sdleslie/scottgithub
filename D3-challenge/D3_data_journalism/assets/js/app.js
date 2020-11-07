// @TODO: YOUR CODE HERE!

// Load data from forcepoints.csv
const path = "./assets/data/data.csv";

// Fetch the CSV data and console log it
d3.csv(path).then(function(healthdata) {

//get the required fields
  var has_health_care = healthdata.map(data => parseFloat(data.healthcare));
  var poverty_status = healthdata.map(data => parseFloat(data.poverty));
  var poverty_Moe = healthdata.map(data => parseFloat(data.povertyMoe));
  var is_smoker = healthdata.map(data => parseFloat(data.smokes));
  var age = healthdata.map(data => parseFloat(data.age));
  var income = healthdata.map(data => parseFloat(data.income));

  color1 = "steelblue"
  color2 = "red"
  color3 = "purple"

scatteritup(healthdata, poverty_status, has_health_care, "poverty", "healthcare", "Poverty Rate (%)","No Healthcare Coverage (%)", color1)
scatteritup(healthdata, age, is_smoker, "age", "smokes", "Age (years)", "Smokers (%)", color2)
scatteritup(healthdata, income, is_smoker, "income", "smokes", "Income (USD)", "Smokers (%)", color3)

function scatteritup(dataset, x_data, y_data, x_text, y_text, x_label, y_label, color) {

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

  // Configure a linear scales with a ranges between the chartHeight/chartWidth and 0
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(x_data)*minPad, d3.max(x_data)*maxPad])
    .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(y_data)*minPad, d3.max(y_data)*maxPad])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Configure a line function which will plot the x and y coordinates using our scales
  var drawLine = d3.line()
    .x(data => xLinearScale(x_data))
    .y(data => yLinearScale(y_data));

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
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "stateCircle")
  .attr("cx", d => xLinearScale(parseFloat(d[x_text])))
  .attr("cy", d => yLinearScale(parseFloat(d[y_text])))
  .attr("r", radius)
  .style("fill", d3.color(color) );
  
chartGroup.selectAll(".stateText")
  .data(dataset)
  .enter()
  .append('text')
  .attr("class", "stateText")
  .attr("x", d => xLinearScale(parseFloat(d[x_text])))
  .attr("y", d => yLinearScale(parseFloat(d[y_text]))+6)
  .text(d => {return d.abbr})

    // Append axes titles
    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
      .classed("x-axis", true)
      .text(x_label);

    chartGroup.append("text")
        .classed("y-axis", true)
        .attr("transform", "rotate(-90)")
        .attr("y",margin.left/3)
        .attr("x",-chartHeight/2 - margin.top)
        .text(y_label);
  }

});