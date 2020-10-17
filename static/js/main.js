// Show that we've loaded the JavaScript file
console.log("Loaded main.js");

// Query the endpoint that returns a JSON ...
d3.json("/dictionary").then(function (data) {

    // ... and dump that JSON to the console for inspection
    console.log(data); 

    // Next, pull out the keys and the values for graphing
    keys = Object.keys(data);
    values = Object.values(data);

    // Create the trace
    var trace = {
        x: keys,
        y: values,
        type: "bar"
    };

    // Put the trace into an array (which allows us to graph
    // multiple traces, if we wish)
    var data = [trace];

    // Define a layout object
    var layout = {
        title: "'Bar' Chart",
        xaxis: { title: "Drinks"},
        yaxis: { title: "Rating"}
    };

    // Create the plot
    Plotly.newPlot("plot", data, layout); 
});

