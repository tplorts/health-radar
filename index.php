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
		
	</style>

    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnOiybCXuruO3EII8NV1aEsa7SWE6mrJg&sensor=false&libraries=visualization">
    </script>
	
	<script type="text/javascript" src="health-indicators.js"></script>
	
	<script type="text/javascript" src="main.js"></script>
	
	<style>
		
	</style>
	
  </head>

	<body onload="init()">

		<table id="main-table"><tbody>
		
			<tr><td>
			
				<div id="options-panel2">
				
					<select data-placeholder="Choose a disease..." class="chzn-select" style="width:350px;" >
						<option value=""></option> 
						<?php
							require "MMWRDiseaseInfo.php";
							foreach( $MMWRDiseases as $name => $nothankyou ) 
								echo "<option value='" . $name . "'>" . $name . "</option>";
						?>
					</select>
				
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
