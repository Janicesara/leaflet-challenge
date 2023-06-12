var link_Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
function size(magnitude) {
    return magnitude * 40000;
  }
//GET  request 
d3.json(link_Url).then(function(data){
    createFeatures(data.features);
});

  // Feature - pop up for eathquake place and time 

  function createFeatures(earthquakeData){
    
    function onEachFeature(feature, layer){

    layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude of Earthquake: ${feature.properties.mag}</p><hr><p> Depth: ${feature.geometry.coordinates[2]}`);
    }
// A layer for feature array 

   
        function createCircleMarker(feature, coordinates){
    var Markers = {
     radius:feature.properties.mag*5,
     fillColor: colorpicking(feature.geometry.coordinates[2]),
     color: "#000",
     weight: 1,
     opacity: 0.8,
     fillOpacity: 0.40,
     
    } 
    return L.circleMarker(coordinates,Markers);
}
var  earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
});

createMap(earthquakes);
}
function colorpicking(depth) {
  return depth >= 90 ? "#92ea2c" :
      depth < 90 && depth >= 70 ? "#2ceabf" :
      depth < 70 && depth >= 50 ? "#FF8E15" :
      depth < 50 && depth >= 30 ? "#d5ea2c" :
      depth < 30 && depth >= 10 ? "#ea2c2c" :
                                  "#2c99ea";
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var depth = [-10, 10, 30, 50, 70, 90];
    var labels = [];
    var legendInfo = "<h4>Depth</h4>";

    div.innerHTML = legendInfo

    for (var i = 0; i < depth.length; i++) {
          labels.push('<ul style="background-color:' + colorpicking(depth[i] + 1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
        }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };
 // Adding legend to the map
   
// Creating Maps 

function createMap(earthquakesData) {
    var grayscalemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
       
      })
      let streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        
      });
      let baseMaps = {
        "Outdoors": streetmap,
        "Grayscale": grayscalemap
      };
    
      // Create overlay object to hold our overlay layer
      let overlayMaps = {
        Earthquakes: earthquakesData
      };
    
      // Create our map, giving it the streetmap and earthquakes layers to display on load
      let myMap = L.map("map", {
        center: [
          39.8282, -98.5795
        ],
        zoom: 4,
        layers: [streetmap, earthquakesData]
      });
      // Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
      
    }
    
