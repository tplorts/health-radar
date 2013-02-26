




function initializeMap() {
	var mapOptions = {
	  zoom: 5,
	  center: new google.maps.LatLng(38.5111,-96.8005),
	  mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	return map;
}


function DiseaseVisual( map, data ) {
	this.map = map;

	this.activeTypes = {
		"heatmap": true,
		"blobs": false
	};
	
	this.heatmap = new google.maps.visualization.HeatmapLayer( {
			data: data,
			dissipating: false,
			map: map,
			opacity: 0.5,
			radius: 4
			//maxIntensity: maxWeight + 20
		} );
}

DiseaseVisual.prototype.activate = function() {
	if( ! this.activeTypes["heatmap"] ) {
		this.heatmap.setMap( this.map );
		this.activeTypes["heatmap"] = true;
	}
}

DiseaseVisual.prototype.deactivate = function() {
	this.heatmap.setMap( null );
	for( type in this.activeTypes )
		this.activeTypes[type] = false;
}


var diseaseVisuals = {};
var activeDiseaseName;

function placeVisual( map, diseaseName, diseaseData ) {
	if( diseaseName == activeDiseaseName )
		return;
	
	if( activeDiseaseName in diseaseVisuals )
		diseaseVisuals[activeDiseaseName].deactivate();
	
	if( diseaseName in diseaseVisuals ) {
		diseaseVisuals[diseaseName].activate();
	} else {
		diseaseVisuals[diseaseName] = new DiseaseVisual( map, diseaseData );
	}
	
	activeDiseaseName = diseaseName;
}

/*
var heatmaps = {};
var activeHeatmapName;

var blobsets = {};
var activeBlobsetName;

function placeHeatmap( mapObject, name, mapData, maxWeight ) {
	if( name == activeHeatmapName ) {
		alert( "Already on that disease" );
		return;
	}
	
	if( activeHeatmapName in heatmaps )
		heatmaps[ activeHeatmapName ].setMap( null );
	
	if( name in heatmaps )
		heatmaps[ name ].setMap( mapObject );
	else {
		var heatmapOptions = {
			data: mapData,
			dissipating: false,
			map: mapObject,
			opacity: 0.5,
			radius: 4,
			maxIntensity: maxWeight + 20
		};
		heatmaps[ name ] = new google.maps.visualization.HeatmapLayer( heatmapOptions );
	}
	
	activeHeatmapName = name;
}

	

function placeBlobset( mapObject, name, mapData, maxWeight ) {
	if( activeBlobsetName in blobsets )
		deactivateBlobset( blobsets[activeBlobsetName] );
	
	if( name in blobsets )
		activateBlobset( blobsets[name] );
	else
		blobsets[ name ] = createBlobset( mapObject, mapData, maxWeight );
	
	activeBlobsetName = name;
}



function createBlobset( mapObject, mapData, maxWeight ) {
	var bs = {};
	for( var i = 0; i < mapData.length; i++ ) {
		var d = mapData[i];
		bs[i] = placeCircleMarker( mapObject, d.location, Math.sqrt( d.weight * 1e3 / maxWeight ), d.weight.toString() );
	}
	return bs;
}
*/

function placeCircleMarker( mapObject, location, weight, tooltip ) {
	var marker = new google.maps.Marker ({
		position: location,
		map: mapObject,
		icon: getCircle( weight ),
		title: tooltip
	});
	google.maps.event.addListener(marker,'click',function() {
		marker.getMap().setZoom( marker.getMap().getZoom() + 1 );
		marker.getMap().setCenter(marker.getPosition());
	});
	return marker;
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