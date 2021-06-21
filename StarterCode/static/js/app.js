function init() {
    var hBarPlot = [{
        type: 'bar',
        orientation: 'h',
        x: [1, 2, 4],
        y: [1, 4, 16],
        text: ['test1', 'test2', 'test3']
    }];

    var layout = {
        title: 'Top 10 Belly Bacteria by Sample',
    }

    Plotly.newPlot("bar", hBarPlot, layout);



    //Read in JSON data and console log it
    d3.json('../samples.json').then(function(data){
        console.log(data);

        //Create variables to plot
        var samples = data.names
        //var sampleValues = data.samples.map(sample => sample.sample_values);
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
            var metaData = [];
            var sampleData = [];
            console.log(sampleID)
            //metaD = data.metadata.filter(filterMetaData(dataset));
            // sampleD = data.filter(filterSamples(dataset));
            //console.log(metaD);
            // console.log(sampleD)
            return sampleID
        };

        //console.log(samples);
        //console.log(sampleValues);
        //console.log(otu_ids);
        //console.log(otu_labels);

    //     var hBarPlot = {
    //         type: 'bar',
    //         orientation: 'h',
    //         x: otu_ids,
    //         y: sampleValues,
    //         text: otu_labels,
    //     };

    //     var hBarLayout = {
    //         title: 'Top 10 Belly Bacteria by Sample',
    //     };

    //     Plotly.restyle("bar", "x", [newSample])
    //     Plotly.restyle("bar", "y", [newSample])
    })
    //hBarPlot();

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
            //Append each key, value pairing from the filtered array
            Object.entries(sampleMeta0).forEach(([key, value]) => {panel.append('h6').text(`${key}: ${value}`);
            });
        });
    };

    demoPanel('946');
};

init();