console.log("Loaded map.js")


// Look to our flask-served census database
var crime_data = "/crime_data";
var census_data = "/census_data";

// Create arrays to hold all census data
var neigborhood = {};
var population = {};
var totalHouseholds = {};
var totalHousingUnits = {};
var occupUnitsPercent = {};
var vacantUnitsPercent ={};
var OOPercent = {};
var ROPercent = {};
var avgHHSize = {};
var avgOOHHSize = {};
var avgROHHSize = {};
var famHHPercent = {};
var marriedHHPercent = {};
var nonFamHHPercent = {};
var ofColorPercent = {};
var whitePercent = {};

// Populate the arrays
d3.json(census_data).then(function(data) {
  data.forEach(function(h) {
    var hoodName = h.Neighborhood;
    population[hoodName] = parseInt(h.Total_population);
    // population.push(h.Neighborhood, h.Total_population);
    totalHouseholds[hoodName] = parseInt(h.Total_households);
    // totalHouseholds.push(h.Total_households);
    totalHousingUnits[hoodName] = parseInt(h.Total_housing_units);
    // totalHousingUnits.push(h.Total_housing_units);
    occupUnitsPercent[hoodName] = parseFloat(h.Occupied_housing_units_Share);
    // occupUnitsPercent.push(h.Occupied_housing_units_Share);
    vacantUnitsPercent[hoodName] = parseFloat(h.Vacant_housing_units_Share);
    // vacantUnitsPercent.push(h.Vacant_housing_units_Share);
    OOPercent[hoodName] = parseFloat(h.Owner_occupied_share);
    // OOPercent.push(h.Owner_occupied_share);
    ROPercent[hoodName] = parseFloat(h.Renter_occupied_Share);
    // ROPercent.push(h.Renter_occupied_Share);
    avgHHSize[hoodName] = parseInt(h.Avg_hsehld_size_occupied);
    // avgHHSize.push(h.Avg_hsehld_size_occupied);
    avgOOHHSize[hoodName] = parseInt(h.Avg_owner_occupied_hsehld_size);
    // avgOOHHSize.push(h.Avg_owner_occupied_hsehld_size);
    avgROHHSize[hoodName] = parseInt(h.Avg_renter_occupied_hsehld_size);
    // avgROHHSize.push(h.Avg_renter_occupied_hsehld_size);
    famHHPercent[hoodName] = parseFloat(h.Family_households_Share);
    // famHHPercent.push(h.Family_households_Share);
    marriedHHPercent[hoodName] = parseFloat(h.Married_fam_hsehlds_Share);
    // marriedHHPercent.push(h.Married_fam_hsehlds_Share);
    nonFamHHPercent[hoodName] = parseFloat(h.Nonfam_hsehlds_Sharey);
    // nonFamHHPercent.push(h.Nonfam_hsehlds_Sharey);
    ofColorPercent[hoodName] = parseFloat(h.Of_Color_Share);
    // ofColorPercent.push(h.Of_Color_Share);
    whitePercent[hoodName] = parseFloat(h.White_Share);
    // whitePercent.push(h.White_Share);
  })
});



// Creating map object
var myMap = L.map("map", {
  center: [44.97, -93.165],
  zoom: 11.75,
  zoomDelta: 0.25,
  zoomSnap: 0.25,
  doubleClickZoom: false,
  scrollWheelZoom: false
});
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 13,
  minZoom: 11,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);
  
// Use this link to get the geojson data.
var stPaul = "static/data/StPaul_Census.geojson";
// repeat with Minneapolis Neighborhoods
var Minneapolis = "static/data/Minneapolis_Census.geojson"
  
  // Our style object
  // var mapStyle = {
  //   color: "grey",
  //   fillColor: "pink",
  //   fillOpacity: 0.5,
  //   weight: 1.5
  // };

function getColor(d) {
  return d > 60000 ? '#4d004b' :
        d > 30000 ? '#810f7c' :
        d > 15000 ? '#88419d' :
        d > 7500 ? '#8c6bb1' :
        d > 3750 ? '#8c96c6' :
        d > 2000 ? '#9ebcda' :
        d > 1500 ? '#bfd3e6' :
        d > 1000 ? '#e0ecf4' :
                    '#f7fcfd';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.Total_population),
    weight: 1.5,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7
  };
}
  
// Grabbing our GeoJSON data..
d3.json(stPaul).then(function(data) {  
  console.log(data);
  // Create a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Passing in our style object
    style: style,
    // Mouseover event
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          }),
          layer.bindTooltip(feature.properties.name2,
            {className:'myLabelStyle',             permanent:true,
            }
          );
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.7
          }),
          layer.unbindTooltip();
        },
        click: function() {
          // alert('Clicked on ' + feature.properties.name2)
          var userHood = feature.properties.name2;
          console.log(userHood);
          console.log(`You clicked on ${userHood}.`);
          function returnValue (a) {
            for ([key, value] of Object.entries(a)) {
              if (key == userHood) {
                return value;
              }
            }
          }
          console.log(returnValue(population));
          console.log(returnValue(totalHouseholds));
          console.log(returnValue(totalHousingUnits));
          console.log(returnValue(occupUnitsPercent));
          console.log(returnValue(vacantUnitsPercent));

        }
      });
    }
  }).addTo(myMap);
});

// Grabbing our GeoJSON data..
d3.json(Minneapolis).then(function(data) {
  console.log(data);
  // Create a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Passing in our style object
    style: style,
    // Attempting a mouseover event
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          }),
          layer.bindTooltip(feature.properties.name,
            {direction:'center',
            className:'myLabelStyle',             permanent:true
            }
          );
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.7
          })
          layer.unbindTooltip();
        },
        click: function() {
          // alert('Clicked on ' + feature.properties.name2)
          var userHood = feature.properties.name;
          console.log(`You clicked on ${userHood}.`);
          function returnValue (a) {
            for ([key, value] of Object.entries(a)) {
              if (key == userHood) {
                return value;
              }
            }
          }
          console.log(returnValue(population));
          console.log(returnValue(totalHouseholds));
          console.log(returnValue(totalHousingUnits));
          console.log(returnValue(occupUnitsPercent));
          console.log(returnValue(vacantUnitsPercent));
        }
      });
      // layer.bindPopup("<h5>" + feature.properties.name + "</h5><hr>" + "<h6>Population: " + feature.properties.Total_population + "</h6");
    }
  }).addTo(myMap);
});


// *********** PLOT BUILDING **********



function buildPlot() {

    // Create the Trace
    var trace1 = {
        x: neigborhood,
        y: OOPercent,
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

    // Plot the chart to a div tag with id "plot1"
    Plotly.newPlot("plot1", data, layout, config);

}
buildPlot();
