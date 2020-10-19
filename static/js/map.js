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
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Use this link to get the geojson data.
  var stPaul = "static/data/StPaul.geojson";

  // repeat with Minneapolis Neighborhoods
  var Minneapolis = "static/data/minneapolis-neighborhoods-2-1.geo"
  
  // Our style object
  var mapStyle = {
    color: "grey",
    fillColor: "pink",
    fillOpacity: 0.5,
    weight: 1.5
  };
  
  // Grabbing our GeoJSON data..
  d3.json(stPaul).then(function(data) { 
    // Create a geoJSON layer with the retrieved data
    L.geoJson(data, {
      // Passing in our style object
      style: mapStyle
    }).addTo(myMap);
  });

  

//   // Grabbing our GeoJSON data..
  d3.json(Minneapolis).then(function(data) { 
  // Create a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Passing in our style object
    style: mapStyle
  }).addTo(myMap);
});