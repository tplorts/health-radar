
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

function animateDisease( map, disease ) {
	$( "#progressbar" ).show();
	$( "#progressbar" ).progressbar({ value: 1 });
	
	latestWeekNo = parseInt( $("#latest-week").text() );
	rxWeeks = 0;
	dataForWeek = {};
	for( var week = 1; week <= latestWeekNo; week++ ) {
		$.getJSON( "QueryMMWR.php",
			{
				"diseaseName": disease,
				"year": $("#latest-year").text(),
				"week": twoDigits( week.toString() )
			},
			function( data, textStatus, jqXHR ) {
				$("#progressbar").progressbar( "value", Math.round(++rxWeeks*100 / latestWeekNo) );
				dataForWeek[parseInt(data.week)] = processIllnessResults( data.statewiseCases );
				if( rxWeeks == latestWeekNo ) {
					$("#progressbar").slideUp();
					startAnimation();
				}
			}
		);
	}
	
}


var displayWeek;
var animationInterval;

function startAnimation() {
	displayWeek = 1;
	animationInterval = setInterval( function() {
			$("#animation-progress").text( displayWeek.toString() );
			placeVisual( mainMap, activeDisease + displayWeek.toString(), dataForWeek[displayWeek] );
			//displayWeek = ((displayWeek + 1) % latestWeekNo) + 1;
			if( ++displayWeek > latestWeekNo )
				displayWeek = 1;
		}, 
		500
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

