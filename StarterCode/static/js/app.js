function init() {
    var traceBar = [{
        type: 'bar',
        orientation: 'h',
        x: [1, 2, 4, 5, 6, 2, 1, 6, 8, 10],
        y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        text: ['test1', 'test2', 'test3']
    }];

    var layout = {
        title: 'Top 10 Belly Bacteria by Sample',
    }

    Plotly.newPlot("bar", traceBar, layout);



    //Read in JSON data and console log it
    d3.json('../samples.json').then(data => {
        console.log(data);

        //Create variables to plot
        const samples = data.names;
        const metaData = data.metadata;
        const sampleData = data.samples;
        let otu_ids = sampleData[1].otu_ids;
        console.log(metaData);
        console.log(sampleData);
        console.log(samples);
        console.log(otu_ids);

        //var metaDssata = data.samples.map(sample => sample.sample_values);
        //var otu_ids = data.samples.map(sample => sample.otu_ids);
        //var otu_labels = data.samples.map(sample =>sample.otu_labels);

        //Append names of each sample to selDataset html id
        samples.forEach((sample) => {d3.select('#selDataset').append('option').text(sample).property('value', sample)
        });

        //Filter data by sample
        function filterSamples(sample) {
            return samples.id === sample;
        };

        function filterMetaData(sample) {
            return data.metadata.id == sample;
        };

        //Add event to listen to each time a different sample is selected
        d3.selectAll("#selDataset").on("change", getData);

        //Write function to pull data for selected sample
        function getData() {
            var dropDownMenu = d3.select("#selDataset");
            var sampleID = dropDownMenu.property("value");
            demoPanel(`${sampleID}`);
            updateBarPlot(`${sampleID}`);
        };

    })

    function updateBarPlot(sampleID) {
        d3.json('../samples.json').then(data => {
            //Set data.samples array to variable for clarity
            let sampleData = data.samples;
            //Filter sampleData to match function input
            let matchedSample = sampleData.filter(sample => sample.id == sampleID);
            //Pull filtered data's otu_id from array
            let match = matchedSample[0];
            //Set variables equal to data from match for plotting
            let matchData = match.sample_values;
            let matchLabel = match.otu_ids;
            let matchText = match.otu_labels;
            //Slice 10 largest values
            let slicedData = matchData.slice(0,10);
            let slicedLabel = matchLabel.slice(0,10);
            let slicedText = matchText.slice(0,10);
            //Reverse for Plotly defaults
            let revData = slicedData.reverse();
            let revLabel = slicedLabel.reverse();
            let revText = slicedText.reverse();
            //Map labels scaling and appearance on
            let labels = revLabel.map(label => `OTU ${label}`)
            //Restyle horizontal bar chart
            Plotly.restyle("bar", "x", [revData]);
            Plotly.restyle("bar", "y", [labels]);
            Plotly.restyle("bar", "text", [revText]);
            console.log(slicedData)
        });
    };

    function demoPanel(sampleID) {
        d3.json('../samples.json').then(data => {
            //Select html object to append metadata to
            let panel = d3.select("#sample-metadata");
            //Set data.metadata to variable for clarity
            let metaData = data.metadata;
            //Filter metaData array to match function input
            let sampleMeta = metaData.filter(sample => sample.id == sampleID);
            //Even though metadata is filtered, must pull filtered data from array
            let sampleMeta0 = sampleMeta[0];
            //Must reset panel html each time or it will append new selection below previous selection
            panel.html('')
            //Append each key, value pairing from the filtered array
            Object.entries(sampleMeta0).forEach(([key, value]) => {panel.append('h6').text(`${key}: ${value}`);
            });
        });
    };

    demoPanel('946');
};

init();