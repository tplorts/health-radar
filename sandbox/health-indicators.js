

var map;
function initialize() {
	var mapOptions = {
	  zoom: 3,
	  center: new google.maps.LatLng(-34.397, 150.644),
	  mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	
	map = new google.maps.Map(document.getElementById('map_canvas'),
		mapOptions);
	
	var countryData = updateCountryInfo();
	
	$.get('WHS3_48.xml', function(data) {
		updateMalariaData( map, countryData, data );
	});
	
	//updateMalariaData( map, countryData );
	
//	for( var code in countryInfo ) {
//		var c = countryInfo[code];
//		placeCircleMarker(map, c.latitude, c.longitude, 5);
//	}
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
    scale: Math.log(magnitude),
    strokeColor: 'white',
    strokeWeight: .5
  };
}