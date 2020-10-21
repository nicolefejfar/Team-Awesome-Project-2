var crime_data = "/crime_data";
var census_data = "/census_data";

// function buildPlot() {
//     var hoodName = [];
//     var hoodOO = [];
//     d3.json(census_data).then(function(data) {
//         data.forEach(function(hood) {
//             hoodName.push(hood.Neighborhood)
//             hoodOO.push(hood.Owner_occupied_share);
            
//             // Create the Trace
//             var trace1 = {
//                 x: hoodName,
//                 y: hoodOO,
//                 type: "bar",
//             };
            
//             // Create the data array for our plot
//             var data = [trace1];

//             // Define our plot layout
//             var layout = {
//                 title: "Owner Occupancy Per Neigborhood",
//                 // xaxis: {title: "Neighborhood"},
//                 yaxis: {title: "Owner Occupancy (Percent)"}
//             };

//             // Make responsive
//             var config = {responsive: true};

//             // Plot the chart to a div tag with id "bar-plot"
//             Plotly.newPlot("plot1", data, layout, config);
//         })
//     });
//     console.log(hoodName);
//     console.log(hoodOO);
// }
// buildPlot();

function buildPlot2() {
    var hoodName = [];
    var hoodOO = [];
    d3.json(census_data).then(function(data) {
        data.forEach(function(hood) {
            hoodName.push(hood.Neighborhood)
            hoodOO.push(hood.Owner_occupied_share);
            
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
            Plotly.newPlot("plot2", data, layout, config);
        })
    });
}
buildPlot2();

