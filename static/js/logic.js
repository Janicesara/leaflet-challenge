var link_Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
function size(magnitude) {
    return magnitude * 40000;
  }
//GET  request 
d3.json(link_Url).then(function(data){
    createFeatures(data.features);
});

  // Feature - pop up for eathquake place and time 

  function createFeatures(earthquakeData, TechnoplatesData){
    
    function onEachFeature(feature, layer){

    layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude of Earthquake: ${feature.properties.mag}</p><hr><p> Felt Reports: ${feature.properties.felt}`);
    }
// A layer for feature array 

   
        function createCircleMarker(feature, coordinates){
    var Markers = {
     radius:feature.properties.mag*5,
     fillColor: colorpicking(feature.properties.mag),
     color: colorpicking(feature.properties.mag),
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
function colorpicking(mag) {
    if (mag <= 1) {
        return "#ea2c2c"
    } else if (mag <= 2) {
        return "#eaa92c"
    } else if (mag <= 3) {
        return "#d5ea2c"
    } else if (mag <= 4) {
        return "#92ea2c"
    } else if (mag <= 5) {
        return "#2ceabf"
    } else {
        return "#2c99ea" ;
    }
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var mag = [1.0, 2.5, 4.0, 5.5, 8.0];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo

    for (var i = 0; i < mag.length; i++) {
          labels.push('<ul style="background-color:' + colorpicking(mag[i] + 1) + '"> <span>' + mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '' : '+') + '</span></ul>');
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
    