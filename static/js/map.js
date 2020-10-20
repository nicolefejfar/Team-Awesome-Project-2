console.log("Loaded map.js")

// Creating map object
var myMap = L.map("map", {
    center: [44.97, -93.165],
    zoom: 11.75,
    zoomDelta: 0.25,
    zoomSnap: 0.25
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
    // Create a geoJSON layer with the retrieved data
    L.geoJson(data, {
      // Passing in our style object
      style: style
    }).addTo(myMap);
  });


  // Grabbing our GeoJSON data..
  d3.json(Minneapolis).then(function(data) { 
  // Create a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Passing in our style object
    style: style
  }).addTo(myMap);



  // L.geoJson(Minneapolis, {style: style}).addto(myMap)
  // L.geoJson(stPaul, {style: style}).addto(myMap)

});