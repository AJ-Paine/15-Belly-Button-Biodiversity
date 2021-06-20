//function hBarPlot(){
    //Read in JSON data and console log it
    d3.json('../samples.json').then(function(data){
        console.log(data);
    
        //Create variables to plot
        var names = data.names
        var sampleValues = data.samples.map(sample => sample.sample_values);
        var otu_ids = data.samples.map(sample => sample.otu_ids);
        var otu_labels = data.samples.map(sample =>sample.otu_labels);

        //Append names of each sample to selDataset html id
        names.forEach((name) => {d3.select('#selDataset').append('option').text(name).property('value', name)
        });

        console.log(names);
        //console.log(sampleValues);
        //console.log(otu_ids);
        //console.log(otu_labels);

        var hBarPlot = {
            type: 'bar',
            orientation: 'h',
            x: otu_ids,
            y: sampleValues,
            text: otu_labels,
        };

        var hBarLayout = {
            title: 'Top 10 Belly Bacteria by Sample',
        };

        Plotly.restyle("bar", "x", [newSample])
        Plotly.restyle("bar", "y", [newSample])



    })
//}





//hBarPlot();