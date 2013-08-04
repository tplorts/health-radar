<!DOCTYPE html>
<html>
  <head>
    <title>Health Radar</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
	
	<!-- ______Libraries______ -->
	
	  <!-- jQuery -->
	  <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js" ></script>
	  
	  <!-- jQuery UI with styles -->
	  <script type="text/javascript" src="http://code.jquery.com/ui/1.10.1/jquery-ui.min.js" ></script>
	  <link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.10.1/themes/base/jquery-ui.css">
	  <link rel="stylesheet" type="text/css" href="ui-darkness/jquery-ui-1.10.1.custom.css">
	  <link rel="stylesheet" type="text/css" href="redmond/jquery-ui-1.10.1.custom.css">
	  
	  <!-- jQuery CSV: reads CSV files with jQuery syntax -->
	  <script type="text/javascript" src="jquery.csv-0.71.min.js" ></script>
	  
	  <!-- Chosen, or chzn: a small but beatiful UI toolkit -->
	  <script src="chosen/chosen.jquery.js" type="text/javascript"></script>
	  <link rel="stylesheet" type="text/css" href="chosen/chosen.css">
	
	  <!-- Google Maps -->
	  <script type="text/javascript"
			  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnOiybCXuruO3EII8NV1aEsa7SWE6mrJg&sensor=false&libraries=visualization">
      </script>

	<!-- /______Libraries______ -->

	<!-- ______Health Radar stuff______ -->

	  <link rel="stylesheet" type="text/css" href="main.css">
      <script type="text/javascript" src="main.js"></script>
      
	<!-- /______Health Radar stuff______ -->

  </head>

  <body onload="start()">
	<div id="container">
	  <div id="happy-loading">
		<img style="top:175px;left:130px;"
			 src="http://stream1.gifsoup.com/view5/4730814/mugatu-happy-happy-o.gif" />
		<img style="opacity: 0.5;"
			 src="http://www.lettersmarket.com/uploads/lettersmarket/blog/loaders/common_blue/ajax_loader_blue_512.gif" />
	  </div>
	  <div id="main-content">
		<table id="main-table">
		  <tbody>
			<tr>
			  <td>
				<table id="options-table" >
				  <tbody>
					<tr>
					  <td>
						<select id="disease-chooser" data-placeholder="Choose a disease..." class="chzn-select" style="width:350px;" >
						  <option value=""></option> 
						  <?php
							 require_once "MMWRDiseaseInfo.php";
							 foreach( $MMWRDiseases as $name => $__ )
						  echo "<option value='" . $name . "'>" . $name . "</option>";
						  ?>
						</select>
					  </td>
					  <td>
						<form>
						  <div id="visual-type-chooser" class="ui-darkness" >
							<input type="radio" name="visual" id="visual1" checked />
							<label for="visual1" >Heatmap</label>
							<input type="radio" name="visual" id="visual2" />
							<label for="visual2" >Blobs</label>
						  </div>
						</form>
					  </td>
					  <td>
						Week
						<select id="fromweek-chooser" data-placeholder="from week" class="chzn-select" style="width: 56px;">
						  <?php
							 require_once "MMWRTime.php";
							 $week = 1;
							 echo "<option value='".$week."' selected>" . ($week) . "</option>";
							 for( $week = 2; $week <= $mostRecentMMWRWeek; ++$week )
													  echo "<option value='".$week."'>" . ($week) . "</option>";
													  ?>
							 </select>
						through
						<select id="toweek-chooser" data-placeholder="to week" class="chzn-select" style="width: 56px;">
						  <?php
							 require_once "MMWRTime.php";
							 for( $week = 1; $week < $mostRecentMMWRWeek; ++$week )
													 echo "<option value='".$week."'>" . ($week) . "</option>";
													 echo "<option value='".$week."' selected>" . ($week) . "</option>";
													 ?>
							 </select>
						<button id="animate-button" >Animate</button>
					  </td>
					  <td>
						Source: <a href="http://wonder.cdc.gov/mmwr/mmwrmorb.asp">MMWR</a>
						<span style="display: none">
						  <?php
							 require_once "MMWRTime.php";
							 require_once "NthText.php";
							 echo "the <span id='latest-week'>" . ( $mostRecentMMWRWeek ) . "</span>";
							 echo "<sup>" . NthText( $mostRecentMMWRWeek ) . "</sup> week";
							 echo " of the year <span id='latest-year'>" . ( $mostRecentMMWRYear ) . "</span>.";
							 ?>
						</span>
					  </td>
					  <td>
						<div id="animation-progress">X</div>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
			<tr id="progress-bar-row">
			  <td>
				<div id="progressbar" class="redmond" ></div>
			  </td>
			</tr>
			<tr id="map-container-row">
			  <td>
				<div id="map-canvas"></div>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </div><!-- main-content -->
	</div><!-- container -->
  </body>
</html>
