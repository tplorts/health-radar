
function placeIllnessMarkers( pMap, diseaseName ) {
	if( diseaseName == activeHeatmapName )
		return;

	$( "#progressbar" ).show();
	$( "#progressbar" ).progressbar({
		value: 0
	});
	
	$("#progressbar").progressbar( "value", 20 );
	
	$.getJSON('QueryMMWR.php', 
		{"diseaseName": diseaseName},
		function(illnesses) {
			$("#progressbar").progressbar( "value", 60 );
			
			$.get("state_latlon.csv", function( stateLocCSV ) {
				$("#progressbar").progressbar( "value", 80 );
				
				stateLocs = $.csv.toObjects( stateLocCSV );
				caseData = [];
				for( var i in stateLocs ) {
					var x = stateLocs[i];
					var n = illnesses[x.state];
					//placeCircleMarker( pMap, parseFloat(x.latitude), parseFloat(x.longitude), n/10 );
					caseData.push({	
						latitude: parseFloat(x.latitude), 
						longitude: parseFloat(x.longitude), 
						weight: n
					});
				}
				$("#progressbar").progressbar( "value", 90 );
				placeHeatmap( pMap, diseaseName, caseData );
				$("#progressbar").progressbar( "value", 100 );
				$("#progressbar").slideUp(500);
				
				//$("#disease-select").append("<li class='ui-state-default '>13</li>");
				//$( "#disease-select li:first" ).trigger("selectableselected");

			});
		}
	);
}

function setDisease( diseaseName ) {
	placeIllnessMarkers( mainMap, diseaseName );
}

function init() {

	$(".chzn-select").chosen().change( function( event, ui ) {
		setDisease( ui.selected );
	});

	$(function() {
		$( "#options-panel" ).accordion({
			collapsible: true,
			active: false
		});
		
	});
	$(function() {
		$( "#disease-select" ).menu({
			select: function( event, ui ) {
				$( "#options-panel" ).accordion({ active: false });
				setDisease( ui.item.text() );
			}
		});
	});

	initializeMap();
}
