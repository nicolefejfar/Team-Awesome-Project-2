console.log("Loaded map.js")

// Look to our flask-served databases
var crime_data = "/crime_data";
var census_data = "/census_data";

// ****************************** Import and manipulate census data **************************

// Create dictionaries to hold all census data
var neigborhood = {};
var population = {};
var totalHouseholds = {};
var totalHousingUnits = {};
var occupUnitsPercent = {};
var vacantUnitsPercent = {};
var OOPercent = {};
var ROPercent = {};
var avgHHSize = {};
var avgOOHHSize = {};
var avgROHHSize = {};
var famHHPercent = {};
var marriedHHPercent = {};
var nonFamHHPercent = {};
var tcTotalHousingUnits =	482702;
var tcTotalHH =	453222;
var tcVacantUnitPercent = 6.1
var tcOccupiedUnitPercent =	93.9
var tcOOPercent =	94.0
var tcROPercent =	6.0

// Populate the arrays
d3.json(census_data).then(function(data) {
  data.forEach(function(h) {
    var hoodName = h.Neighborhood;
    population[hoodName] = parseInt(h.Total_population);
    totalHouseholds[hoodName] = parseInt(h.Total_households);
    totalHousingUnits[hoodName] = parseInt(h.Total_housing_units);
    occupUnitsPercent[hoodName] = parseFloat(h.Occupied_housing_units_Share);
    vacantUnitsPercent[hoodName] = parseFloat(h.Vacant_housing_units_Share);
    OOPercent[hoodName] = parseFloat(h.Owner_occupied_share);
    ROPercent[hoodName] = parseFloat(h.Renter_occupied_Share);
    avgHHSize[hoodName] = parseInt(h.Avg_hsehld_size_occupied);
    avgOOHHSize[hoodName] = parseInt(h.Avg_owner_occupied_hsehld_size);
    avgROHHSize[hoodName] = parseInt(h.Avg_renter_occupied_hsehld_size);
    famHHPercent[hoodName] = parseFloat(h.Family_households_Share);
    marriedHHPercent[hoodName] = parseFloat(h.Married_fam_hsehlds_Share);
    nonFamHHPercent[hoodName] = parseFloat(h.Nonfam_hsehlds_Sharey);
  })
});

// ********************************** Import and manipulate crime data ********************************

var crimeType = [];
var crimeCount = [];
var crimeYear = [];
var crimeCounts = {};
var nhCounts = {};

d3.json(crime_data).then(function(data) {
// console.log(data);
  data.forEach(function(crime) {
    crimeType.push(crime.Incident)
    crimeCount.push(crime.Count)
    crimeYear.push(crime.Year);

    var currentcrime2 = crime.Neighborhood;
    // If the crime has been seen before...
    if (currentcrime2 in nhCounts) {
      // Add crime count to the sum
      nhCounts[currentcrime2] += crime.Count;
      }
    else {
      // Set the amount to first count of crime
      nhCounts[currentcrime2] = crime.Count;
      }
    return nhCounts;
  })
});

// *********************************** Create Map Object **********************************

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
  id: "mapbox/light-v10",
  // id options: light-v10, dark-v10, streets-v11, satellite-v9
  accessToken: API_KEY
}).addTo(myMap);
  
// Get St. Paul GeoJSON data
var stPaul = "static/data/StPaul_Census.geojson";
// Get Minneapolis GeoJSON data
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

// ***************************** St. Paul GeoJSON & Filtered charts **********************************

// Grabbing our GeoJSON data..
d3.json(stPaul).then(function(data) {
  // Create a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Passing in our style object
    style: style,
    // Mouseover event
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h6> ${feature.properties.name2} </h6><hr><p>Population: ${feature.properties.Total_population}<br>Housing Units: ${feature.properties.Total_housing_units}<br>Average Household Size: ${feature.properties.Avg_hsehld_size_occupied}</p>`);
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          }),
          layer.bindTooltip(feature.properties.name2,
            {direction:'center',
            className:'myLabelStyle',
            permanent:true,
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
          var userHood = feature.properties.name2;
          console.log(userHood);
          function returnValue (a) {
            for ([key, value] of Object.entries(a)) {
              if (key == userHood) {
                return value;
              }
            }
          }
          // **************************** Filtered bar chart ********************************
          d3.json(crime_data).then(function(data) {
            var crimeTypeFiltered = [];
            var crimeCountFiltered = [];
            var crimeYearFiltered = [];
            var crimeCountsFiltered = {};  

            data.forEach(function(crime) {
              if (crime.Neighborhood == userHood) {
                crimeTypeFiltered.push(crime.Incident)
                crimeCountFiltered.push(crime.Count)
                crimeYearFiltered.push(crime.Year);
        
                var currentcrime = crime.Incident;
                  // If the crime has been seen before...
                  if (currentcrime in crimeCountsFiltered) {
                      // Add crime count to the sum
                      crimeCountsFiltered[currentcrime] += crime.Count;
                    }
                  else {
                    // Set the amount to first count of crime
                    crimeCountsFiltered[currentcrime] = crime.Count;
                    }
                return crimeCountsFiltered;
              }
            })
            console.log(crimeCountsFiltered);
        
            newKeys = [];
            newValues = [];
        
            for (var key in crimeCountsFiltered) {
              newKeys.push(key);
              newValues.push(crimeCountsFiltered[key]);
            }
      
            function newPlot() {
      
            // Create the Trace
            var trace1 = {
              x: newKeys,
              y: newValues,
              type: "bar",
              marker: {
                color: 'rgb(124, 109, 167'
              }
            };
          
            // Create the data array for our plot
            var data = [trace1];
    
            // Define our plot layout
            var layout = {
              title: {
                text: `${userHood} Cities Crime by Type, 2018-2020`,
                font: {
                  color: 'rgb(105, 34, 107)',
                  size: 18
                }
              },
              yaxis: {title: "Total Occurrences"}
          };
      
            // Make responsive
            var config = {responsive: true};
      
            // Plot the chart to a div tag with id "plot1"
            Plotly.newPlot("plot1", data, layout, config);
      
            }
            newPlot();
          });
 
          // *************************** Filtered donut chart *****************************
 
          function newDonut() {
            var chart = new Chartist.Pie('.ct-chart', {
              series: [returnValue(OOPercent), returnValue(ROPercent), returnValue(vacantUnitsPercent)],
              labels: [`${returnValue(OOPercent)}% Owner Occupied`, `${returnValue(ROPercent)}% Renter Occupied`, `${returnValue(vacantUnitsPercent)}% Vacant Units`]
            }, {
              donut: true,
              showLabel: true
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
              window.__anim21278907124 = setTimeout(chart.update.bind(chart), 70000);
            });
          }   
          newDonut();
        }
      });
    }
  }).addTo(myMap);
});

// ***************************** Minneapolis GeoJSON & Filtered charts ***************************************

// Grabbing our GeoJSON data
d3.json(Minneapolis).then(function(data) {
  // Create a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Passing in our style object
    style: style,
    // Add a mouseover event
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h6> ${feature.properties.name} </h6><hr><p>Population: ${feature.properties.Total_population}<br>Housing Units: ${feature.properties.Total_housing_units}<br>Average Household Size: ${feature.properties.Avg_hsehld_size_occupied}</p>`);
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          }),
          layer.bindTooltip(feature.properties.name,
            {direction:'center',
            className:'myLabelStyle',
            permanent:true
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
          var userHood = feature.properties.name;
          console.log(userHood);
          function returnValue (a) {
            for ([key, value] of Object.entries(a)) {
              if (key == userHood) {
                return value;
              }
            }
          }

          // ***************************** Filtered bar chart ****************************
          d3.json(crime_data).then(function(data) 
          {
            var crimeTypeFiltered = [];
            var crimeCountFiltered = [];
            var crimeYearFiltered = [];
            var crimeCountsFiltered = {};  

            // console.log(data);
            data.forEach(function(crime) {
                if (crime.Neighborhood == userHood) {
                  crimeTypeFiltered.push(crime.Incident)
                  crimeCountFiltered.push(crime.Count)
                  crimeYearFiltered.push(crime.Year);
          
                  var currentcrime = crime.Incident;
                    // If the crime has been seen before...
                    if (currentcrime in crimeCountsFiltered) {
                        // Add crime count to the sum
                        crimeCountsFiltered[currentcrime] += crime.Count;
                      }
                    else {
                      // Set the amount to first count of crime
                      crimeCountsFiltered[currentcrime] = crime.Count;
                      }
                  return crimeCountsFiltered;
                }
              })
        
              newKeys = [];
              newValues = [];
        
              for (var key in crimeCountsFiltered) {
                newKeys.push(key);
                newValues.push(crimeCountsFiltered[key]);
              }
              
              console.log(crimeCountsFiltered);

              function newPlot() {
                // Create the Trace
                var trace1 = {
                  x: newKeys,
                  y: newValues,
                  type: "bar",
                  marker: {
                    color: 'rgb(124, 109, 167'
                  }
                };
          
                // Create the data array for our plot
                var data = [trace1];
        
                // Define our plot layout
                var layout = {
                  title: {
                    text: `${userHood} Cities Crime by Type, 2018-2020`,
                    font: {
                      color: 'rgb(105, 34, 107)',
                      size: 18
                    }
                  },
                  yaxis: {title: "Total Occurrences"}
              };
        
                // Make responsive
                var config = {responsive: true};
        
                // Plot the chart to a div tag with id "plot1"
                Plotly.newPlot("plot1", data, layout, config);
        
              }
            newPlot();
          });

          // **************************** Filtered donut chart *****************************

          function newDonut() {

            var chart = new Chartist.Pie('.ct-chart', {
              series: [returnValue(OOPercent), returnValue(ROPercent), returnValue(vacantUnitsPercent)],
              labels: [`${returnValue(OOPercent)}% Owner-Occupied`, `${returnValue(ROPercent)}% Renter-Occupied`, `${returnValue(vacantUnitsPercent)}% Vacant`],
              colors: ["#f00","#f0f","#00f"],
            }, {
              donut: true,
              showLabel: true
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
              window.__anim21278907124 = setTimeout(chart.update.bind(chart), 70000);
            });
          }   
          newDonut();
        }
      });
    }
  }).addTo(myMap);
});

// ************************** Initialize Twin Cities Bar Graph *****************************
console.log('Twin Cities Crime')

d3.json(crime_data).then(function(data) {
  data.forEach(function(crime) {
    crimeType.push(crime.Incident)
    crimeCount.push(crime.Count)
    crimeYear.push(crime.Year);

    var currentcrime = crime.Incident;
      // If the crime has been seen before...
      if (currentcrime in crimeCounts) {
          // Add crime count to the sum
          crimeCounts[currentcrime] += crime.Count;
        }
      else {
        // Set the amount to first count of crime
        crimeCounts[currentcrime] = crime.Count;
        }
    return crimeCounts;
  })
  console.log(crimeCounts);

  keys = [];
  values = [];

  for (var key in crimeCounts) {
    keys.push(key);
    values.push(crimeCounts[key]);
  }

  function buildPlot() {
    // Create the Trace
    var trace1 = {
      x: keys,
      y: values,
      type: "bar",
      marker: {
        color: 'rgb(124, 109, 167'
      }
    };
    
    // Create the data array for our plot
    var data = [trace1];

    // Define our plot layout
    var layout = {
        title: {
          text: "Twin Cities Crime by Type, 2018-2020",
          font: {
            color: 'rgb(105, 34, 107)',
            size: 18
          }
        },
        yaxis: {title: "Total Occurrences"}
    };

    // Make responsive
    var config = {responsive: true};

    // Plot the chart to a div tag with id "plot1"
    Plotly.newPlot("plot1", data, layout, config);
  }
  buildPlot();
  });

// ************************** Initialize Twin Cities Donut *****************************

var chart = new Chartist.Pie('.ct-chart', {
  series: [tcOOPercent, tcROPercent],
    // , tcVacantUnitPercent], - Took this out because the above adds up to 100 %
  labels: [`${tcOOPercent}% Owner-Occupied`, `${tcROPercent}% Renter-Occupied`]
  // , `${tcVacantUnitPercent}% Vacant`] - Took this out because the above adds up to 100 %
}, {
  donut: true,
  showLabel: true
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
  window.__anim21278907124 = setTimeout(chart.update.bind(chart), 70000);
});