// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level.
let map = L.map("mapid", {
    center: [
      40.7, -94.5
    ],
    zoom: 4
  });

// We create the tile layer that will be the background of our map.
let darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let pvData = "https://raw.githubusercontent.com/jzebker/pvOpenData/main/Sunny_Days/Sun_Map/sun_map_aggregated.geojson"

function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.capacity_mw),
    color: "#000000",
    radius: getRadius(feature.properties.area_sq_km),
    stroke: true,
    weight: 0.5
  };
}

function getColor(MW) {
  if (MW > 300000) {
    return "#ea2c2c";
  }
  if (MW > 200000) {
    return "#ea822c";
  }
  if (MW > 100000) {
    return "#ee9c00";
  }
  return "#eecc00";
}

function getRadius(km) {
  return km / 1000;
}

// Grabbing our GeoJSON data.
d3.json(pvData).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
                console.log(data);
                return L.circleMarker(latlng);
            },
        style: styleInfo,
        // We create a popup for each circleMarker to display the magnitude and
        //  location of the earthquake after the marker has been created and styled.
        onEachFeature: function(feature, layer) {
        layer.bindPopup("Capacity (MW): " + feature.properties.capacity_mw + "<br>Area (Sq. km): " + feature.properties.area_sq_km);
      }
        }).addTo(map);
});
// Add our tile layer to the map.
darkmap.addTo(map);