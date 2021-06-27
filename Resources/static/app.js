function init() {
    //Load JSON
    d3.json('./Resources/samples.json').then(data => {
        //Print json to console
        console.log(data);
        //Set-Up initial hBar plot with empty data
        var traceBar = [{
            type: 'bar',
            orientation: 'h',
            x: [],
            y: [],
            text: [],
        }];
        //Set-up Layout
        var layout = {
            title: 'Top 10 Belly Bacteria for Sample',
        };
        //Set-up initial bubble plot with empty data
        var traceBubble = [{
            type: 'scatter',
            mode: 'markers',
            marker: {
                opacity: 0.75,
                color: 'red',
                size: 20,
                line: {
                    color: 'black',
                    width: 2,
                },
            },
            x: [],
            y: [],
            text: []
        }];
        var layoutBubble = {
            title: `Sample X`,
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of OTU Present'}
        };
        //Set-up initial bubble plot with empty data
        var traceGauge = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: 20,
                title: { text: "Belly Button Washing Frequency"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [0, 10]},
                    bar: {color: "darkgrey"},
                    steps: [
                        {range: [0, 1], color: "darkred"},
                        {range: [1, 2], color: "red"},
                        {range: [2, 3], color: "darkorange"},
                        {range: [3, 4], color: "orange"},
                        {range: [4, 5], color: "gold"},
                        {range: [5, 6], color: "yellow"},
                        {range: [6, 7], color: "greenyellow"},
                        {range: [7, 8], color: "lawngreen"},
                        {range: [8, 9], color: "limegreen"},
                        {range: [9, 10], color: "green"},
                    ],
                }
            }];
        var layoutGauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        //Use plotly to display charts
        Plotly.newPlot("bar", traceBar, layout);
        Plotly.newPlot("bubble", traceBubble, layoutBubble);
        Plotly.newPlot('gauge', traceGauge, layoutGauge);
        //Pull first sample name
        firstSample = data.names[0];
        //Run plotting and panel functions with first sample
        barPlot(firstSample);
        demoPanel(firstSample);
        bubblePlot(firstSample);
        gaugePlot(firstSample);
        //Append names of each sample to selDataset html id for dropdown menu
        data.names.forEach((sample) => {d3.select('#selDataset').append('option').text(sample).property('value', sample)});
        //Add event to listen to each time a different sample is selected
        d3.selectAll("#selDataset").on("change", getData);
        //Write function to pull data for selected sample and call functions to update plots & panels
        function getData() {
            var dropDownMenu = d3.select("#selDataset");
            var sampleID = dropDownMenu.property("value");
            barPlot(`${sampleID}`);
            bubblePlot(sampleID);
            demoPanel(`${sampleID}`);
            gaugePlot(sampleID);
        };
        //Function to update bar plot
        function barPlot(sampleID) {
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
            let labels = revLabel.map(label => `OTU ${label}`);
            //Create new title with sample name
            let newLayout = {
                title: `Top 10 Belly Bacteria for Test Subject: ${sampleID}`,
            };
            //Restyle horizontal bar chart
            Plotly.restyle("bar", "x", [revData]);
            Plotly.restyle("bar", "y", [labels]);
            Plotly.restyle("bar", "text", [revText]);
            Plotly.relayout("bar", newLayout);
        };
        //Function to update bubblePlot
        function bubblePlot(sampleID) {
            //Set data.samples array to variable for clarity
            let sampleData = data.samples;
            //Filter sampleData to match function input
            let matchedSample = sampleData.filter(sample => sample.id == sampleID);
            //Pull filtered data's otu_id from array
            let match = matchedSample[0];
            //Define variables to update plot
            let matchData = match.sample_values;
            let matchLabel = match.otu_ids;
            let matchText = match.otu_labels;
            //Create new layout with title
            let newLayout = {
                title: `OTU ID and Quantity for Test Subject: ${sampleID}`
            };
            //Restyle bubble chart
            Plotly.restyle("bubble", "x", [matchLabel]);
            Plotly.restyle("bubble", "y", [matchData]);
            Plotly.restyle("bubble", "text", [matchText]);
            Plotly.restyle("bubble", "marker.color", [matchLabel]);
            Plotly.restyle("bubble", "marker.size", [matchData]);
            Plotly.relayout("bubble", newLayout);
        };
        //Function to update demographic panel
        function demoPanel(sampleID) {
            //Select html object to append metadata to
            let panel = d3.select("#sample-metadata");
            //Set data.metadata to variable for clarity
            let metaData = data.metadata;
            //Filter metaData array to match function input
            let sampleMeta = metaData.filter(sample => sample.id == sampleID);
            //Even though metadata is filtered, must pull filtered data from array
            let sampleMeta0 = sampleMeta[0];
            //Must reset panel html each time or it will append new selection below previous selection
            panel.html('');
            //Append each key, value pairing from the filtered array
            Object.entries(sampleMeta0).forEach(([key, value]) => {panel.append('h6').text(`${key}: ${value}`);
            });
        };
        //Function to update gauge plot
        function gaugePlot(sampleID) {
            //Set data.samples array to variable for clarity
            let metaData = data.metadata;
            //Filter sampleData to match function input
            let matchedSample = metaData.filter(sample => sample.id == sampleID);
            //Pull filtered data's otu_id from array
            let match = matchedSample[0];
            //Set variables equal to data from match for plotting
            let washFreq = match.wfreq;
            //Needle Indicator
            //Set angle to 180 - wfreq * (180/# of sections in gauge)
            //Needle starts at 180 deg (180 deg = 0 belly washes)
            let angle = 180 - +match.wfreq * 180/10
            let radius = 0.5
            //SOHCAHTOA for coordinates
            let x = radius*Math.cos(angle*Math.PI/180)
            let y = radius*Math.sin(angle*Math.PI/180)
            //Restyle horizontal bar chart
            Plotly.restyle("gauge", "value", [washFreq]);
            console.log(x);
            console.log(y);
        };
    });
};

init();
