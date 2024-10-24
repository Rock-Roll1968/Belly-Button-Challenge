
let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const optionChanged = async id => {
    let { names, metadata, samples } = await d3.json(url);

// mames
    if(id == undefined) {
      names.forEach(name => {
        d3.select("select").append("option").text(name)
      });

      id = names[0];
    };

// Demographic
    let meta = metadata.find(obj => obj.id == id);

    d3.select("#sample-metadata").html("");
    
    Object.entries(meta).forEach(([key,val]) => {
      d3.select("#sample-metadata").append("h5").text(`${key.toUpperCase()}: ${val}`);
    });

// Bar chart
    let { otu_ids, sample_values, otu_labels } = samples.find(obj => obj.id == id);

    let combinedData = otu_ids.map((id, index) => ({
        id: id,
        value: sample_values[index],
        label: otu_labels[index]
    }));

    combinedData.sort((a, b) => b.value - a.value);
    combinedData = combinedData.slice(0, 10).reverse();
    
    
    var data = [
      {
        x: combinedData.map(d => d.value),
        y: combinedData.map(d => `OTU ${d.id}`),
        text: combinedData.map(d => d.label),
        type: 'bar',
        orientation: 'h',
       }];
    
    Plotly.newPlot('bar', data);
};

// Bubble chart

 let samples = [
    {
      id: 1,
      otu_ids: [1167],
      sample_values: [165],
      otu_labels: []
    },
  ]; 

 function createBubbleChart(id) {

  let {otu_ids, sample_values, otu_labels } = samples.find(obj => obj.id == id);
  

  var trace = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Earth',
      opacity: 0.6
    }
  };

  var data = [trace];

  var layout = {
    title: 'Bubble Chart for Each Sample',
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Value' },
    showlegend: false,
    height: 600,
    width: 1000
  };

  Plotly.newPlot('bubble', data, layout)
 }

createBubbleChart(1);

let init = optionChanged;

init();
