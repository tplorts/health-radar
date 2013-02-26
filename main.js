
var mainMap;
var activeDisease;
var visualType;

function start() {
	$("#disease-chooser").chosen().change( function( event, ui ) {
		setDisease( ui.selected );
	});
	
	$( "#visual-type-chooser" ).buttonset();
	
	var selectedVisualId = $( "#visual-type-chooser input:checked" ).attr("id");
	visualType = $( "#visual-type-chooser label[for='"+selectedVisualId+"']" ).text();
	
	$( "#visual-type-chooser label" ).click( function( event ) {
		var previousVisual = visualType;
		visualType = $(this).text();
		if( visualType != previousVisual )
			refreshIllnessLayer();
	});
	
	mainMap = initializeMap();
}


function setDisease( diseaseName ) {
	if( diseaseName == activeDisease )
		return;

	activeDisease = diseaseName;
	
	$( "#progressbar" ).show();
	$( "#progressbar" ).progressbar({ value: 10 });
	
	$.getJSON( 'QueryMMWR.php', {"diseaseName": diseaseName}, processIllnessResults );
}


function processIllnessResults( illnesses ) {
	$("#progressbar").progressbar( "value", 50 );
	
	$.get("state_latlon.csv", function( stateLocCSV ) {
		$("#progressbar").progressbar( "value", 70 );
		
		stateLocs = $.csv.toObjects( stateLocCSV );
		caseData = [];
		maxOccurences = 0;
		for( var i in stateLocs ) {
			var x = stateLocs[i];
			var n = parseInt( illnesses[x.state] );
			caseData.push({
				location: new google.maps.LatLng( parseFloat(x.latitude), parseFloat(x.longitude) ),
				weight: n
			});
			if( n > maxOccurences )
				maxOccurences = n;
		}
		
		$("#progressbar").progressbar( "value", 90 );
		
		if( visualType == "Heatmap" )
			placeHeatmap( mainMap, activeDisease, caseData, maxOccurences );
		else if( visualType == "Blobs" )
			placeBlobset( mainMap, activeDisease, caseData, maxOccurences );
		else
			alert( "What is '" + visualType + "'?" );
		
		$("#progressbar").progressbar( "value", 100 );
		$("#progressbar").slideUp(500);

	});
}

