
var mainMap;
var activeDisease = null;
var visualType;
var stateLocations;

function start() {
	$("#disease-chooser").chosen().change( function( event, ui ) {
		setDisease( ui.selected );
	});
	
	$( "#visual-type-chooser" ).buttonset();
	
	visualType = getSelectedVisualType();

	$( "#visual-type-chooser input" ).change( function( event ) {
		var previousVisual = visualType;
		visualType = getSelectedVisualType();
		if( visualType != previousVisual )
			refreshDiseaseLayer();
	});
	
	$( "#animate-button" ).button().click( function(event) {
		animateDisease( mainMap, activeDisease );
	});
	
	mainMap = initializeMap();
	
	stateLocations = fetchStateLocations();
}

function twoDigits( s ) {
	if( s.length == 2 ) return s;
	return "0"+s;
}


var rxWeeks;
var dataForWeek;
var latestWeekNo;
var firstWeek;
var weekSpan;

var animation;

function animateDisease( map, disease ) {
	$( "#progressbar" ).show();
	$( "#progressbar" ).progressbar({ value: 1 });
	
	latestWeekNo = parseInt( $("#latest-week").text() );
	rxWeeks = 0;
	firstWeek = 20;
	weekSpan = latestWeekNo - firstWeek + 1;
	dataForWeek = {};
	for( var week = firstWeek; week <= latestWeekNo; week++ ) {
		$.getJSON( "QueryMMWR.php",
			{
				"diseaseName": disease,
				"year": $("#latest-year").text(),
				"week": twoDigits( week.toString() )
			},
			function( data, textStatus, jqXHR ) {
				$("#progressbar").progressbar( "value", Math.round(++rxWeeks*100 / weekSpan) );
				dataForWeek[parseInt(data.week)] = processIllnessResults( data.statewiseCases );
				if( rxWeeks == weekSpan ) {
					animation = DiseaseAnimation( map, dataForWeek, firstWeek, latestWeekNo );
					$("#progressbar").slideUp();
					startAnimation();
				}
			}
		);
	}
	
}


var diseaseVisuals = {};


var displayWeek;
var animationInterval;

function startAnimation() {
	displayWeek = firstWeek;
	animationInterval = setInterval( function() {
			animation.step();
						
			if( ++displayWeek > latestWeekNo )
				displayWeek = firstWeek;
			$("#animation-progress").text( displayWeek.toString() );
		}, 
		1000
	);
}

function stopAnimation() {
	clearInterval( animationInterval );
}


function getSelectedVisualType() {
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
		$( "#progressbar" ).show();
		$( "#progressbar" ).progressbar({ value: 33 });
		$.getJSON( "QueryMMWR.php",
			{
				"diseaseName": diseaseName,
				"year": $("#latest-year").text(),
				"week": twoDigits( $("#latest-week").text() )
			},
			function( data, textStatus, jqXHR ) {
				$("#progressbar").progressbar( "value", 66 );
				placeVisual( mainMap, activeDisease, processIllnessResults( data.statewiseCases ) );
				$("#progressbar").progressbar( "value", 100 );
				$("#progressbar").slideUp();
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

