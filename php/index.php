<!DOCTYPE html>
<html>
  <head>
    <title>Health Radar -- Chlamydia cases reported within the past week</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
		<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js" ></script>
		<script type="text/javascript" src="http://code.jquery.com/ui/1.10.1/jquery-ui.min.js" ></script>
		<script type="text/javascript" src="jquery.csv-0.71.min.js" ></script>
		
		<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.10.1/themes/base/jquery-ui.css">
		

	<style>
		body {
			font-family: "Trebuchet MS", "Helvetica", "Arial",  "Verdana", "sans-serif";
			font-size: 80%;
		}
		html, body, #main-table {
			margin: 0;
			padding: 0;
			height: 100%;
			width: 100%;
		}
		#map-container-row {
			height: 100%;
		}
		#map-canvas {
			margin: 0;
			padding: 0;
			height: 100%
		}
		
	</style>
	
	<style>
		#feedback { font-size: 1.4em; }
		#disease-select .ui-selecting { background: #FECA40; }
		#disease-select .ui-selected { background: #F39814; color: white; }
		#disease-select { list-style-type: none; margin: 0; padding: 0; width: 100%; }
		#disease-select li { 
			margin: 3px;
			padding: 4px;
			float: left;  
			font-size: 1.2em;
		}
	</style>

    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnOiybCXuruO3EII8NV1aEsa7SWE6mrJg&sensor=false&libraries=visualization">
    </script>
	
	<script type="text/javascript" src="health-indicators.js"></script>
	
	<script type="text/javascript">
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
		$(function() {
			$( "#options-panel" ).accordion({
				collapsible: true,
				active: false
			});
			
		});
		$(function() {
			$( "#disease-select" ).selectable({
				selected: function( event, ui ) {
					$( "#options-panel" ).accordion({ active: false });
					setDisease( $(ui.selected).text() );
				}
			});
		});

		initializeMap();
	}
	</script>
	
  </head>

	<body onload="init()">

		<table id="main-table"><tbody>
		
			<tr><td>
			
				<div id="options-panel"> <p> <em>Options</em> </p>
					<ol id="disease-select">
									<!-- Table A -->
						<li class="ui-state-default">Chlamydia trachomatis infection</li>
						<li class="ui-state-default">Coccidioidomycosis</li>
						<li class="ui-state-default">Cryptosporidiosis</li>
									<!-- Table B -->
						<li class="ui-state-default">Dengue Fever</li>
						<li class="ui-state-default">Dengue Hemorrhagic Fever</li>
									<!-- Table C -->
						<li class="ui-state-default">Ehrlichia chaffeensis</li>
						<li class="ui-state-default">Anaplasma phagocytophilum</li>
						<li class="ui-state-default">Undetermined</li>
									<!-- Table D -->
						<li class="ui-state-default">Giardiasis</li>
						<li class="ui-state-default">Gonorrhea</li>
						<li class="ui-state-default">Haemophilus influenzae</li>
									<!-- Table E -->
						<li class="ui-state-default">Hepatitis A</li>
						<li class="ui-state-default">Hepatitis B</li>
						<li class="ui-state-default">Hepatitis C</li>
									<!-- Table F -->
						<li class="ui-state-default">Legionellosis</li>
						<li class="ui-state-default">Lyme disease</li>
						<li class="ui-state-default">Malaria</li>
									<!-- Table G -->
						<li class="ui-state-default">Meningococcal diseases</li>
						<li class="ui-state-default">Mumps</li>
						<li class="ui-state-default">Pertussis</li>
									<!-- Table H -->
						<li class="ui-state-default">Rabies, animal</li>
						<li class="ui-state-default">Salmonellosis</li>
						<li class="ui-state-default">Shiga toxin-producing E. coli</li>
									<!-- Table I -->
						<li class="ui-state-default">Shigellosis</li>
						<li class="ui-state-default">Spotted Fever Rickettsiosis, confirmed</li>
						<li class="ui-state-default">Spotted Fever Rickettsiosis, probable</li>
									<!-- Table J -->
						<li class="ui-state-default">Streptococcus pneumoniae, all ages</li>
						<li class="ui-state-default">Streptococcus pneumoniae, ages < 5</li>
						<li class="ui-state-default">Syphillis, primary & secondary</li>
									<!-- Table K -->
						<li class="ui-state-default">Varicella (chickenpox)</li>
						<li class="ui-state-default">West Nile virus disease, Neuroinvasive</li>
						<li class="ui-state-default">West Nile virus disease, Non-neuroinvasive</li>
					</ol>
				</div>
				
			</td></tr>
			
			<tr id="progress-bar-row"><td>
				<div id="progressbar"></div>
			</td></tr>
		
			<tr id="map-container-row"><td>
				<div id="map-canvas"></div>
			</td></tr>
		
		</tbody></table>

	</body>
</html>
