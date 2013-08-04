<?php

require_once('../QueryPath/QueryPath.php');

$db = new mysqli( "127.0.0.1", "root", "", "health_radar" );
if ($db->connect_errno) {
  echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
}

class LocationLL {
  public $latitude;
  public $longitude;

  public function __construct( $lat, $lon ) {
    $this->latitude = floatval($lat);
    $this->longitude = floatval($lon);
  }

};

class USAState {
  public $name = null;
  public $abbreviation = null;
  public $oldGPO = null;
  public $location = null;
  public $presentPopulation = null;
  public $censusPopulation = null;
  /*
  public function __construct() {
    $this->name = "default";
    $this->abbreviation = "default";
    $this->oldGPO = "default";
    $this->location = "default";
    $this->presentPopulation = "default";
    $this->censusPopulation = "default";    
  }
  */
  public function __construct( $pName, $pAbbrev, $pOldGPO ) {
    $this->name = $pName;
    $this->abbreviation = $pAbbrev;
    $this->oldGPO = $pOldGPO;
  }
  
};


function columnContent( $qpRow, $column ) {
  return $qpRow->branch()->find( "td:eq(".$column.")" )->text();
}


$NBSP = mb_convert_encoding('&nbsp;', 'UTF-8', 'HTML-ENTITIES');



$docStates = new DOMDocument();
$docStates->loadHTMLFile("http://en.wikipedia.org/wiki/List_of_U.S._state_abbreviations");
$qpStates = qp($docStates->saveHTML());
$qpStateTable = $qpStates->find("div#mw-content-text table.wikitable");
$states = array();
$statesByAbbrev = array();
foreach( $qpStateTable->find("tr") as $stateRow ) {
  $status = $stateRow->branch()->find("td:eq(2)")->text();
  if( preg_match("/^(State.*|Federal district)/", $status) ) {
    $stateCode = $stateRow->branch()->find("td:eq(4)")->text();
    $stateName = $stateRow->branch()->find("td:eq(1)")->text();
    $stateOldGPOAbbrev = str_replace( $NBSP, " ", $stateRow->branch()->find("td:eq(8)")->text() );
    $s = new USAState($stateName, $stateCode, $stateOldGPOAbbrev);
    $states[$stateName] = $s;
    $statesByAbbrev[$stateCode] =& $states[$stateName];
  }
}

$docStates = new DOMDocument();
$docStates->loadHTMLFile("http://en.wikipedia.org/wiki/List_of_U.S._states_and_territories_by_population");
$qpStates = qp($docStates->saveHTML());
$qpStateTable = $qpStates->find("div#mw-content-text table.wikitable");
foreach( $qpStateTable->find("tr") as $stateRow ) {
  $name = $stateRow->branch()->find( "td:eq(3) a" )->text();
  if( $name && array_key_exists($name, $states) ) {
    $populationNow = preg_replace( "/,/", "", columnContent( $stateRow, 4 ) );
    $population2010 = preg_replace( "/,/", "", columnContent( $stateRow, 5 ) );
    if( is_numeric($populationNow) ) {
      $s =& $states[$name];
      $s->censusPopulation = intval($population2010);
      $s->presentPopulation = intval($populationNow);
    }
  }
}

$rawCSVLocations = file_get_contents( "../state_latlon.csv" );
$locations = array_slice( array_chunk( str_getcsv( $rawCSVLocations ), 3 ), 1 );
foreach( $locations as $L ) {
  if( array_key_exists($L[0], $statesByAbbrev) ) {
    $statesByAbbrev[$L[0]]->location = new LocationLL( $L[1], $L[2] );
  } else {
  }
}

$nextID = 800;
foreach( $states as $stateName => $stateInfo ) {
  $q = "INSERT INTO usa_state_info(id,name,abbreviation,abbreviation_old_gpo,census_population,present_population,latitude,longitude) VALUES (" .
    $nextID++ .','.
    '"'.$stateInfo->name.'"' .','.
    '"'.$stateInfo->abbreviation.'"' .','.
    '"'.$stateInfo->oldGPO.'"' .','.
    $stateInfo->censusPopulation .','.
    $stateInfo->presentPopulation .','.
    $stateInfo->location->latitude .','.
    $stateInfo->location->longitude .')';
  echo $q."<br>";
  $queryResult = $db->query( $q );
  if( !$queryResult ) {
    echo "Bad: " . $db->errno . ',' . $db->error . "<br>";
  } else {
    //    echo "Good";
  }
}