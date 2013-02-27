
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
	
	/*
	$( "#visual-type-chooser label" ).click( function( event ) {
		var previousVisual = visualType;
		visualType = $(this).text();
		if( visualType != previousVisual )
			refreshDiseaseLayer();
	});
	*/
	$( "#visual-type-chooser input" ).change( function( event ) {
		var previousVisual = visualType;
		visualType = getSelectedVisualType();
		if( visualType != previousVisual )
			refreshDiseaseLayer();
	});
	
	mainMap = initializeMap();
	
	stateLocations = fetchStateLocations();
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
	
	function twoDigits( s ) {
		if( s.length == 2 ) return s;
		return "0"+s;
	}
	
	if( diseaseName in diseaseVisuals ) {
		placeVisual( undefined, diseaseName, undefined );
	} else {
		$( "#progressbar" ).show();
		$( "#progressbar" ).progressbar({ value: 10 });
		$.getJSON(	"QueryMMWR.php",
					{	"diseaseName": diseaseName,
						"year": $("#latest-year").text(),
						"week": twoDigits( $("#latest-week").text() )
					},
					processIllnessResults );
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
	$("#progressbar").progressbar( "value", 50 );
		
	caseData = {};
	maxCases = 0;
	for( var state in stateLocations ) {
		var n = parseInt( illnesses[state] );
		caseData[state] = n;
		if( n > maxCases )
			maxCases = n;
	}
	
	$("#progressbar").progressbar( "value", 80 );
	
	placeVisual( mainMap, activeDisease, {cases:caseData, max:maxCases} );
	
	/*
	if( visualType == "Heatmap" )
		placeHeatmap( mainMap, activeDisease, caseData, maxCases );
	else if( visualType == "Blobs" )
		placeBlobset( mainMap, activeDisease, caseData, maxCases );
	else
		alert( "What is '" + visualType + "'?" );
	*/
	
	$("#progressbar").progressbar( "value", 100 );
	$("#progressbar").slideUp(500);

}

