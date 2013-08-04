
var mainMap;
var activeDisease = null;
var visualType;
var stateLocations;

var fromWeek;
var toWeek;

function start() {
	$("#disease-chooser").chosen().change( function( event, ui ) {
		setDisease( ui.selected );
	});
	
	$( "#visual-type-chooser" ).buttonset();
	
	visualType = selectedVisualType();

	$( "#visual-type-chooser input" ).change( function( event ) {
		var previousVisual = visualType;
		visualType = selectedVisualType();
		if( visualType != previousVisual )
			refreshDiseaseLayer();
	});

	fromWeek = parseInt( $("#fromweek-chooser option:enabled").attr("value") );
	toWeek = parseInt( $("#toweek-chooser option:enabled").attr("value") );
	
	$("#fromweek-chooser").chosen().change( function(event, ui){
		fromWeek = parseInt( ui.selected );
		if (fromWeek > toWeek) {
			fromWeek = toWeek;
		}
		setMinimumToWeek(fromWeek);
	});
	
	$("#toweek-chooser").chosen().change( function(event, ui){
		toWeek = parseInt( ui.selected );
		if (fromWeek > toWeek) {
			toWeek = fromWeek;
		}
		setMaximumFromWeek(toWeek);
	});
	
	$( "#animate-button" ).button().click( function(event) {
		animateDisease( mainMap, activeDisease );
	});
	
	mainMap = initializeMap();
	
	stateLocations = fetchStateLocations();
}

function setMinimumToWeek( minimum ) {
	$("#toweek-chooser option").attr("disabled", false).trigger("liszt:updated");
	$("#toweek-chooser option:lt(" + (minimum-1).toString() + ")").attr("disabled", true).trigger("liszt:updated");
}

function setMaximumFromWeek( maximum ) {
	$("#fromweek-chooser option").attr("disabled", false).trigger("liszt:updated");
	$("#fromweek-chooser option:gt(" + (maximum-1).toString() + ")").attr("disabled", true).trigger("liszt:updated");
}

function twoDigits( s ) {
	if( s.length >= 2 ) return s;
	return "0"+s;
}


var rxWeeks;
var dataByWeek;
var weekSpan;

var animation;

function animateDisease( map, disease ) {
	$( "#progressbar" ).show();
	$( "#progressbar" ).progressbar({ value: 0 });
	
	rxWeeks = 0;
	weekSpan = toWeek - fromWeek + 1;
	dataByWeek = {};
	for( var week = fromWeek; week <= toWeek; week++ ) {
		$.getJSON( "QueryMMWR.php",
			{
				"diseaseName": disease,
				"year": $("#latest-year").text(),
				"week": twoDigits( week.toString() )
			},
			function( data, textStatus, jqXHR ) {
				$("#progressbar").progressbar( "value", Math.round(++rxWeeks*100 / weekSpan) );
				dataByWeek[parseInt(data.week)] = processIllnessResults( data.statewiseCases );
				if( rxWeeks == weekSpan ) {
					animation = new DiseaseAnimation( map, dataByWeek, fromWeek, toWeek );
					$("#progressbar").slideUp();
					animation.start();
				}
			}
		);
	}
	
}


var diseaseVisuals = {};







function selectedVisualType() {
	var selectedId = $( "#visual-type-chooser input:checked" ).attr("id");
	var type = $( "#visual-type-chooser label[for='"+selectedId+"']" ).text();
	return type;
}

function refreshDiseaseLayer() {
	if( activeDisease == null )
		return;
	
	placeVisual( undefined, activeDisease, undefined );
}


function setDisease( diseaseName ) {
	activeDisease = diseaseName;
	
	if( diseaseName in diseaseVisuals ) {
		placeVisual( undefined, diseaseName, undefined );
	} else {
		$("#happy-loading").fadeIn();
		$.getJSON( "QueryMMWR.php",
			{
				"diseaseName": diseaseName,
				"year": $("#latest-year").text(),
				"week": twoDigits( $("#latest-week").text() )
			},
			function( data, textStatus, jqXHR ) {
				placeVisual( mainMap, activeDisease, processIllnessResults( data.statewiseCases ) );
				$("#happy-loading").fadeOut();
			}
		);
	}
}

function fetchStateLocations() {
	var sl = {};
	$.get( "state_latlon.csv", function( stateLocCSV ) {
		arr = $.csv.toObjects( stateLocCSV );
		for( var i in arr ) {
			var stateEntry = arr[i];
			sl[stateEntry.state] = new google.maps.LatLng( parseFloat(stateEntry.latitude), parseFloat(stateEntry.longitude) );
		}
	} );
	return sl;
}
	
function processIllnessResults( illnesses ) {
	caseData = {};
	maxCases = 0;
	for( var state in stateLocations ) {
		var n = parseInt( illnesses[state] );
		caseData[state] = n;
		if( n > maxCases )
			maxCases = n;
	}
	return { 
		cases: caseData, 
		max: maxCases 
	};
}






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
	this.weekSpan = this.lastWeek - this.firstWeek + 1;
	this.currentWeek = this.firstWeek;
	
	this.accumulatedData = [];
	this.accumulatedData[this.firstWeek] = weeklyData[this.firstWeek];
	for( week = this.firstWeek + 1; week <= this.lastWeek; week++ ) {
		this.accumulatedData[week] = addData( this.accumulatedData[week - 1], weeklyData[week] );
	}
	
	this.globalMax = this.accumulatedData[lastWeek].max;
	
	this.dvisual = new DiseaseVisual( map, this.accumulatedData[this.currentWeek] );
	this.dvisual.heatmap.maxIntensity = this.globalMax * 1.1;

	this.intervalId = null;
}

DiseaseAnimation.prototype.start = function() {
	this.currentWeek = this.firstWeek;
	this.intervalId = setInterval( function() {
			animation.step();
		},
		800
	);
}

DiseaseAnimation.prototype.stop = function() {
	clearInterval( this.intervalId );
}

DiseaseAnimation.prototype.step = function() {
	if( ++this.currentWeek > this.lastWeek )
		this.currentWeek = this.firstWeek;
	this.dvisual.setData( this.accumulatedData[this.currentWeek] );
	$("#animation-progress").text( this.currentWeek.toString() );
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
