




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


var activeDiseaseName;

function placeVisual( map, diseaseName, diseaseData ) {
	if( diseaseName == activeDiseaseName ) {
		diseaseVisuals[activeDiseaseName].setData( diseaseData );
		return;
	}
	
	if( activeDiseaseName in diseaseVisuals )
		diseaseVisuals[activeDiseaseName].deactivate();
	
	if( diseaseName in diseaseVisuals ) {
		diseaseVisuals[diseaseName].activate();
	} else {
		diseaseVisuals[diseaseName] = new DiseaseVisual( map, diseaseData );
	}
	
	activeDiseaseName = diseaseName;
}


function createHeatmapData( data ) {
	var heatmapData = [];
	for( var state in data.cases ) {
		heatmapData.push({
			location: stateLocations[state],
			weight: data.cases[state]
		});
	}
	return heatmapData;
}

function addData( original, next ) {
	var newData = {
		cases: {},
		max: 0
	};
	for( var state in original.cases ) {
		newData.cases[state] = original.cases[state] + next.cases[state];
		if( newData.cases[state] > newData.max )
			newData.max = newData.cases[state];
	}
	return newData;
}


function DiseaseVisual( map, data ) {
	this.map = map;
	this.data = data;

	this.activeTypes = {
		"heatmap": true,
		"blobs": true
	};
	
	this.heatmap = new google.maps.visualization.HeatmapLayer({
		data: createHeatmapData( data ),
		dissipating: false,
		map: (visualType == "Heatmap" ? map : null),
		opacity: 0.5,
		radius: 4,
		maxIntensity: data.max + 30
	});
	
	this.blobLayer = new BlobLayer({
		data: data,
		map: (visualType == "Blobs" ? map : null)
	});
}

DiseaseVisual.prototype.activate = function() {
	if( visualType == "Heatmap" )
		this.heatmap.setMap( this.map );
	else if( visualType == "Blobs" )
		this.blobLayer.setMap( this.map );
}

DiseaseVisual.prototype.deactivate = function() {
	this.setMap( null );
}

DiseaseVisual.prototype.setData = function( newData ) {
	this.data = newData;
	this.heatmap.setData( createHeatmapData(this.data) );
}


DiseaseVisual.prototype.setMap = function( pMap ) {
	this.heatmap.setMap( pMap );
	this.blobLayer.setMap( pMap );
}


function DiseaseAnimation( map, weeklyData, firstWeek, lastWeek ) {
	this.firstWeek = firstWeek;
	this.lastWeek = lastWeek;
	this.weekSpan = lastWeek - firstWeek + 1;
	
	this.accumulatedData = [];
	this.accumulatedData[firstWeek] = weeklyData[firstWeek];
	for( week = firstWeek + 1; week <= lastWeek; week++ ) {
		this.accumulatedData[week] = addData( this.accumulatedData[week - 1], weeklyData[week] );
	}
	
	this.globalMax = this.accumulatedData[lastWeek].max;
	
	this.currentWeek = firstWeek;
	this.dvisual = DiseaseVisual( map, this.accumulatedData[this.currentWeek] );
	this.dvisual.heatmap.maxIntensity = this.globalMax * 1.1;
}

DiseaseAnimation.prototype.step = function() {
	if( ++this.currentWeek > this.lastWeek )
		this.currentWeek = firstWeek;
	this.dvisual.setData( this.accumulatedData[this.currentWeek] );
}



function BlobLayer( blobOptions ) {
	this.map = blobOptions.map;
	this.blobs = {};
	var max = Math.sqrt( blobOptions.data.max + 1 );
	for( state in blobOptions.data.cases ) {
		var cases = blobOptions.data.cases[state];
		var size = Math.sqrt( cases ) * 40/max;
		this.blobs[state] = placeBlob( this.map, stateLocations[state], size, state+": "+cases.toString() );
	}
}

BlobLayer.prototype.setMap = function( pMap ) {
	for( var state in this.blobs ) {
		this.blobs[state].setMap( pMap );
	}
}


function placeBlob( mapObject, location, size, tooltip ) {
	var marker = new google.maps.Marker ({
		position: location,
		map: mapObject,
		icon: getCircle( size ),
		title: tooltip
	});
	google.maps.event.addListener(marker,'click',function() {
		marker.getMap().setZoom( marker.getMap().getZoom() + 1 );
		marker.getMap().setCenter(marker.getPosition());
	});
	return marker;
}


function getCircle( size ) {
	return {
		path: google.maps.SymbolPath.CIRCLE,
		fillColor: 'red',
		fillOpacity: .2,
		scale: size,
		strokeColor: 'white',
		strokeWeight: .5
	};
}