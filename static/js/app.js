
let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const optionChanged = async id => {
    let { names, metadata, samples } = await d3.json(url);

// names
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
    
// Bubble chart     
    let trace = {
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
    }

    let data1 = [trace];

    let layout = {
      title: 'Bubble Chart',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values'},
      height: 600,
      width: 1000
    };

    Plotly.newPlot('bubble', data1);
};

let init = optionChanged;

init();
