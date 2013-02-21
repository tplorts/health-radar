
<?php

require 'QueryPath/QueryPath.php';



function getOldGPOStateAbbreviations() {
	$docStates = new DOMDocument();
	$docStates->loadHTMLFile("http://en.wikipedia.org/wiki/List_of_U.S._state_abbreviations");
	$qpStates = qp($docStates->saveHTML());
	$qpStateTable = $qpStates->find("div#mw-content-text table.wikitable");
	$states = array();
	foreach( $qpStateTable->find("tr") as $stateRow ) {
		$status = $stateRow->branch()->find("td:eq(2)")->text();
		if( preg_match("/^(State.*|Federal district)/", $status) ) {
			$stateCode = $stateRow->branch()->find("td:eq(4)")->text();
			$stateName = $stateRow->branch()->find("td:eq(1)")->text();
			$stateOldGPOAbbrev = $stateRow->branch()->find("td:eq(8)")->text();
			$states[$stateOldGPOAbbrev] = $stateCode;
		}
	}
	$states["N.Y. City"] = "NYC";
	$states["N.Y. (Upstate)"] = "NY";
	return $states;
}
//////////////////////////////////////////////////////////////////////////////////////////////

$isTest = ( array_key_exists("test", $_GET) );
if( $isTest )
	echo "This is a test.";
else {

if( $isTest && !array_key_exists("diseaseName", $_GET) )
	$queriedDisease = "Chlamydia trachomatis infection";
else
	$queriedDisease = $_GET["diseaseName"];
libxml_use_internal_errors( !$isTest );
ini_set( 'display_errors', ($isTest ? 'On' : 'Off') );



$stateArray = getOldGPOStateAbbreviations();
if( $isTest )
	echo var_dump( $stateArray );

$mmwrTimeOptions = new DOMDocument();		
$mmwrTimeOptions->loadHTMLFile("http://wonder.cdc.gov/mmwr/mmwrmorb.asp");
$qpMmwrTimeOptions = qp($mmwrTimeOptions->saveHTML());

$yearPresent = $qpMmwrTimeOptions->branch()->find("select[name='mmwr_year'] option[selected]")->text();
$weekPresent = $qpMmwrTimeOptions->find("select[name='mmwr_week'] option[selected]")->text();

if( $isTest )
	echo "Using year ".$yearPresent." and week number ".$weekPresent.".<br />";


$diseaseTableIds = [
	"Chlamydia trachomatis infection" => ["2A", 1],
	"Coccidioidomycosis" => ["2A", 2],
	"Cryptosporidiosis" => ["2A", 3],
	"Dengue Fever" => ["2B", 1],
	"Dengue Hemorrhagic Fever" => ["2B", 2],
	"Ehrlichia chaffeensis" => ["2C", 1],
	"Anaplasma phagocytophilum" => ["2C", 2],
	"Undetermined" => ["2C", 3],
	"Giardiasis" => ["2D", 1],
	"Gonorrhea" => ["2D", 2],
	"Haemophilus influenzae" => ["2D", 3],
	"Hepatitis A" => ["2E", 1],
	"Hepatitis B" => ["2E", 2],
	"Hepatitis C" => ["2E", 3],
	"Legionellosis" => ["2F", 1],
	"Lyme disease" => ["2F", 2],
	"Malaria" => ["2F", 3],
	"Meningococcal diseases" => ["2G", 1],
	"Mumps" => ["2G", 2],
	"Pertussis" => ["2G", 3],
	"Rabies, animal" => ["2H", 1],
	"Salmonellosis" => ["2H", 2],
	"Shiga toxin-producing E. coli" => ["2H", 3],
	"Shigellosis" => ["2I", 1],
	"Spotted Fever Rickettsiosis, confirmed" => ["2I", 2],
	"Spotted Fever Rickettsiosis, probable" => ["2I", 3],
	"Streptococcus pneumoniae, all ages" => ["2J", 1],
	"Streptococcus pneumoniae, ages < 5" => ["2J", 2],
	"Syphillis, primary & secondary" => ["2J", 3],
	"Varicella (chickenpox)" => ["2K", 1],
	"West Nile virus disease, Neuroinvasive" => ["2K", 2],
	"West Nile virus disease, Non-neuroinvasive" => ["2K", 3],
];

if( $isTest )
	var_dump( $diseaseTableIds );

$d = $diseaseTableIds[ $queriedDisease ];
$t = $d[0];
$c = 2 + 5*($d[1] - 1);

if( $isTest )
	echo "<br/>For disease '".$queriedDisease."' we will query table ".$t." and look to column number ".$c.".<br />";

$mmwrTableUrl = "http://wonder.cdc.gov/mmwr/mmwr_reps.asp?mmwr_year=".$yearPresent."&mmwr_week=".$weekPresent."&mmwr_table=".$t;

if( $isTest )
	echo "<br/>About to request <a href='".$mmwrTableUrl."'>this</a>.<br />";

if( !$isTest ) {

	$doc = new DOMDocument();		
	$doc->loadHTMLFile($mmwrTableUrl);
	$qpMMWR = qp($doc->saveHTML());
	$qpMMWRTable = $qpMMWR->find("table:eq(8)");

	if( $isTest )
		echo $qpMMWRTable->branch()->html();

	$illnessCases = array();
	foreach( $qpMMWRTable->find("tr") as $caseRow ) {
		$stateAbbr = trim( $caseRow->branch()->find("td:eq(1)")->text() );
		$stateAbbr = substr( $stateAbbr, 2 );
		if(array_key_exists( $stateAbbr, $stateArray )) {
			$casesThisWeek = $caseRow->branch()->find("td:eq(".$c.")")->text();
			if( $casesThisWeek == "-" || $casesThisWeek == "N" || $casesThisWeek == "NN" || $casesThisWeek == "U" )
				$casesThisWeek = 0;
			else
				$casesThisWeek = intval( $casesThisWeek );
			$illnessCases[ $stateArray[$stateAbbr] ] = $casesThisWeek;
		}
	}
	echo json_encode( $illnessCases );
}

}
