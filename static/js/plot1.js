var crime_data = "static/data/merged_crime.csv";
var census_data = "static/data/merged_census_mini.csv";

function buildPlot() {
    d3.csv(census_data).then(function(data) {
        var hoodName = [];
        var hoodOO = [];
        
        data.forEach(function(hood) {
            hoodName.push(hood.Neighborhood)
            hoodOO.push(hood.Owner_occupied_share);
            console.log(hoodName);
            console.log(hoodOO);
            // console.log(hood.Neighborhood);
            // console.log(hood.Owner_occupied_share);
            
            // Create the Trace
            var trace1 = {
                x: hoodName,
                y: hoodOO,
                type: "bar",
            };
            
            // Create the data array for our plot
            var data = [trace1];

            // Define our plot layout
            var layout = {
                title: "Owner Occupancy Per Neigborhood",
                // xaxis: {title: "Neighborhood"},
                yaxis: {title: "Owner Occupancy (Percent)"}
            };

            // Make responsive
            var config = {responsive: true};

            // Plot the chart to a div tag with id "bar-plot"
            Plotly.newPlot("plot1", data, layout, config);
        })
    });
}
buildPlot();
