

var mainMap;



function initializeMap() {
	var mapOptions = {
	  zoom: 5,
	  center: new google.maps.LatLng(38.5111,-96.8005),
	  mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
	mainMap = map;
	return map;
}

var heatmaps = {};
var activeHeatmapName;

function placeHeatmap( mapObject, name, mapData ) {
	if( name == activeHeatmapName ) {
		alert( "Already on that disease" );
		return;
	}

	var heatmapData = [];
	for (var i = 0; i < mapData.length; i++) {
		heatmapData.push({
			location: new google.maps.LatLng(mapData[i].latitude, mapData[i].longitude),
			weight: mapData[i].weight
		});
	}
	
	if( activeHeatmapName in heatmaps )
		heatmaps[ activeHeatmapName ].setMap( null );
	
	heatmaps[ name ] = new google.maps.visualization.HeatmapLayer({
		data: heatmapData,
		dissipating: false,
		map: mapObject,
		opacity: 0.5,
		radius: 4,
		maxIntensity: 100
	});
	activeHeatmapName = name;
}


function placeCircleMarker(mapObject, lat, lon, magnitude) {
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lon),
		map: mapObject,
		icon: getCircle(magnitude)
	});
}


function getCircle(magnitude) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .2,
    scale: magnitude,
    strokeColor: 'white',
    strokeWeight: .5
  };
}