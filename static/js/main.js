console.log("Loaded map.js")


// Look to our flask-served census database
var crime_data = "/crime_data";
var census_data = "/census_data";

// ******************************** start working with census data *****************************

// Create dictionaries to hold all census data
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

// ***************************************** end work on importing census data *****************************************

// ***************************************** import and manipulate crime data ********************************
var crimeName = [];
var crimeType = [];
var crimeCount = [];
var crimeCity = [];
var crimeYear = [];
var crimeCounts = {};
var nhCounts = {};

d3.json(crime_data).then(function(data) 
  {
  console.log(data);
  data.forEach(function(crime) 
    {
      crimeName.push(crime.Neighborhood)
      crimeType.push(crime.Incident)
      crimeCount.push(crime.Count)
      crimeYear.push(crime.Year);

      var currentcrime = crime.Incident;
        // If the crime has been seen before...
        if (currentcrime in crimeCounts) 
          {
            // Add crime count to the sum
            crimeCounts[currentcrime] += crime.Count;
          }
        else 
          {
    //       // Set the amount to first count of crime
          crimeCounts[currentcrime] = crime.Count;
          }
      return crimeCounts;
      
    })
  });

  d3.json(crime_data).then(function(data) 
  {
  console.log(data);
  data.forEach(function(crime) 
    {
      crimeName.push(crime.Neighborhood)
      crimeType.push(crime.Incident)
      crimeCount.push(crime.Count)
      crimeCity.push(crime.City)
      crimeYear.push(crime.Year);

      var currentcrime2 = crime.Neighborhood;
        // If the crime has been seen before...
        if (currentcrime2 in nhCounts) 
          {
            // Add crime count to the sum
            nhCounts[currentcrime2] += crime.Count;
          }
        else 
          {
      //       // Set the amount to first count of crime
            nhCounts[currentcrime2] = crime.Count;
          }
          
      return nhCounts;
      
    })
  });

//  Check your numbers.
console.log(crimeName);
console.log(crimeType);
console.log(crimeCount);
console.log(crimeYear);
console.log(crimeCounts);
console.log(nhCounts);

var neighborhoods_key = Object.keys(nhCounts);  
console.log(neighborhoods_key);

// ***************************************** end work on importing crime data *****************************************

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

          function newPlot() {

            // Create the Trace
            var trace1 = {
                x: ["Occupied", "Vacant", "Owner Occupied", "Renter Occupied"],
                y: [returnValue(occupUnitsPercent), returnValue(vacantUnitsPercent), returnValue(OOPercent), returnValue(ROPercent)],
                type: "bar",
            };

            
            // Create the data array for our plot
            var data = [trace1];
        
            // Define our plot layout
            var layout = {
                title: `${userHood} Neighborhood Occupancy Percentages`,
                // xaxis: {title: "Neighborhood"},
                yaxis: {title: "Percentage Rate"}
            };
        
            // Make responsive
            var config = {responsive: true};
        
            // Plot the chart to a div tag with id "plot1"
            Plotly.newPlot("plot1", data, layout, config);
        
          }   
          newPlot();


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

          function newPlot() {

            // Create the Trace
            var trace1 = {
                x: ["Occupied", "Vacant", "Owner Occupied", "Renter Occupied"],
                y: [returnValue(occupUnitsPercent), returnValue(vacantUnitsPercent), returnValue(OOPercent), returnValue(ROPercent)],
                type: "bar",
            };

            
            // Create the data array for our plot
            var data = [trace1];
        
            // Define our plot layout
            var layout = {
                title: `${userHood} Neighborhood Occupancy Percentages`,
                // xaxis: {title: "Neighborhood"},
                yaxis: {title: "Percentage Rate"}
            };
        
            // Make responsive
            var config = {responsive: true};
        
            // Plot the chart to a div tag with id "plot1"
            Plotly.newPlot("plot1", data, layout, config);
        
          }   
          newPlot();
        }
      });
      // layer.bindPopup("<h5>" + feature.properties.name + "</h5><hr>" + "<h6>Population: " + feature.properties.Total_population + "</h6");
    }
  }).addTo(myMap);
});


// *********** PLOT BUILDING **********


function buildPlot() {
  // we're going to put twin cities crime totals by type here
  // the filtered version will have crimte totals by type for the clicked neighborhood

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

// ***************** Donut!!! **************




var chart = new Chartist.Pie('.ct-chart', {
  // series: [Object.values(nhCounts)],
  // labels: [Object.keys(nhCounts)]
  series: [10, 20, 50, 20, 5, 50, 15],
  labels: [1, 2, 3, 4, 5, 6, 7]
}, {
  donut: true,
  showLabel: true
  // plugins: [
  //   Chartist.plugins.fillDonut({
  //       items: [{
        //     content: '<i class="fa fa-tachometer"></i>',
        //     position: 'bottom',
        //     offsetY : 10,
        //     offsetX: -2
        // }, {
    //         content: '<h6>crimes<span class="small">by Neighborhood</span></h6>'
    //     }]
    //   })
    // ],
});

chart.on('draw', function(data) {
  if(data.type === 'slice') {
    // Get the total path length in order to use for dash array animation
    var pathLength = data.element._node.getTotalLength();

    // Set a dasharray that matches the path length as prerequisite to animate dashoffset
    data.element.attr({
      'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
    });

    // Create animation definition while also assigning an ID to the animation for later sync usage
    var animationDefinition = {
      'stroke-dashoffset': {
        id: 'anim' + data.index,
        dur: 1000,
        from: -pathLength + 'px',
        to:  '0px',
        easing: Chartist.Svg.Easing.easeOutQuint,
        // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
        fill: 'freeze'
      }
    };

    // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
    if(data.index !== 0) {
      animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
    }

    // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
    data.element.attr({
      'stroke-dashoffset': -pathLength + 'px'
    });

    // We can't use guided mode as the animations need to rely on setting begin manually
    // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
    data.element.animate(animationDefinition, false);
  }
});



// For the sake of the example we update the chart every time it's created with a delay of 8 seconds
chart.on('created', function() {
  if(window.__anim21278907124) {
    clearTimeout(window.__anim21278907124);
    window.__anim21278907124 = null;
  }
  window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
});


