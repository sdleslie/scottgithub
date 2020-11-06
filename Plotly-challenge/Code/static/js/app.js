const path = "./samples.json";

var datastore

palletes = ['Electric','Default','Picnic','Greens','Jet','Portland']

d3.json(path).then(function(data) {
    datastore = data
    console.log(data)
    populateSelectElement(d3.select("#selDataset"),data.names)
    populateSelectElement(d3.select("#bubbleColors"),palletes)
    samples=data.samples
    update()
});

function update() {
    var selected = d3.select("#selDataset").property("value");
    var pallette = d3.select("#bubbleColors").property("value");
    demopanel(selected);
    charts(selected, pallette);
}

function populateSelectElement (element, names) {
    names.forEach(name=>{
        element.append("option")
        .attr("value",name)
        .text(name)
    }
)}

function demopanel(selected) {  
    selecteddata = datastore.metadata.filter((row)=>{return row.id == selected});
    // console.log(selecteddata)
    demographics = d3.select("#sample-metadata")
    demographics.selectAll("p").remove()
    Object.entries(selecteddata[0]).forEach(
        (item) => {demographics.append("p").text(`${item[0]} - ${item[1]}`)}
    )
}

function charts(selected, pallette) {
    chartdata = samples.filter((row)=>{return row.id == selected})[0];
    sample_values = chartdata.sample_values;
    otu_ids = chartdata.otu_ids;
    otu_labels = chartdata.otu_labels;

    var trace1 = [{
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(item=>`OTU ${item} `).reverse(),
        text: otu_labels,
        type: "bar",
        orientation: "h"
      }];
    layout1 = {title: "Top 10 OTUs"};
      Plotly.newPlot("bar", trace1, layout1);
    
    var trace2 = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size:sample_values,
            color: otu_ids,
            // colorscale: 'YlGnBu'
            // colorscale: 'RdBu'
            // colorscale: 'Picnic'
            colorscale: pallette,
            opacity: .707
        }
        
      }];
    layout2 = {title: "Bubble size: number of samples"};
      Plotly.newPlot("bubble", trace2, layout2);

      // console.log(chartdata)

 }

d3.select("#selDataset").on("click", function() {
    update()
})

d3.select("#bubbleColors").on("click", function() {
    update()
})

