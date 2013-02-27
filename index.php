<!DOCTYPE html>
<html>
  <head>
    <title>Health Radar</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
	
	<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js" ></script>
	
	<script type="text/javascript" src="jquery.csv-0.71.min.js" ></script>
	
	<script type="text/javascript" src="http://code.jquery.com/ui/1.10.1/jquery-ui.min.js" ></script>
	<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.10.1/themes/base/jquery-ui.css">
	<!--link rel="stylesheet" type="text/css" href="ui-darkness/jquery-ui-1.10.1.custom.css"-->
	<link rel="stylesheet" type="text/css" href="redmond/jquery-ui-1.10.1.custom.css">
	
	<script src="chosen/chosen.jquery.js" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" href="chosen/chosen.css">
		
		

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
		
		/* overriding the height of the dropdown for diseases */
		.chzn-container .chzn-results {
		/* #disease_chooser_chzn { */
		  max-height: 400px;
		}
		
	</style>

    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnOiybCXuruO3EII8NV1aEsa7SWE6mrJg&sensor=false&libraries=visualization">
    </script>
	
	<script type="text/javascript" src="health-indicators.js"></script>
	<script type="text/javascript" src="main.js"></script>
	
  </head>

	<body onload="start()">

		<table id="main-table"><tbody>
		
			<tr><td>
			
				<table><tbody><tr>
				  <td>
					<select id="disease-chooser" data-placeholder="Choose a disease..." 
							class="chzn-select" style="width:350px;" >
						<option value=""></option> 
						<?php
							require "MMWRDiseaseInfo.php";
							foreach( $MMWRDiseases as $name => $nothankyou ) 
								echo "<option value='" . $name . "'>" . $name . "</option>";
						?>
					</select>
				  </td>
				  <td>
					<form>
						<div id="visual-type-chooser" class="redmond" >
							<input type="radio" name="visual" id="visual1" checked />
								<label for="visual1" >Heatmap</label>
							<input type="radio" name="visual" id="visual2" />
								<label for="visual2" >Blobs</label>
						</div>
					</form>
				  </td>
				  <td>
					The <a href="http://wonder.cdc.gov/mmwr/mmwrmorb.asp">MMWR</a> has data available as recent as 
					<?php
						require "MMWRTime.php";
						//require "int2roman.php";
						require "NthText.php";
						echo "the " . ( $mostRecentMMWRWeek ) . "<sup>" . NthText( $mostRecentMMWRWeek )
									. "</sup> week of the year " . ( $mostRecentMMWRYear ) . ".";
					?>
				  </td>
				</tr></tbody></table>
				
			</td></tr>
			
			<tr id="progress-bar-row"><td>
				<div id="progressbar" class="redmond" ></div>
			</td></tr>
		
			<tr id="map-container-row"><td>
				<div id="map-canvas"></div>
			</td></tr>
		
		</tbody></table>

	

	</body>
</html>
