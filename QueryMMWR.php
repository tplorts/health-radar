<?php

require_once 'QueryPath/QueryPath.php';
require_once 'StateAbbreviations.php';
require_once 'MMWRDiseaseInfo.php';
require_once "MMWRTime.php";

libxml_use_internal_errors( true );

$isTest = ( array_key_exists("test", $_GET) );
if( $isTest )
	echo "<p>This is a test.</p>";

if( $isTest && !array_key_exists("diseaseName", $_GET) )
	$queriedDisease = "Chlamydia trachomatis infection";
else
	$queriedDisease = $_GET["diseaseName"];

if( $isTest )
	echo "<p>Disease: '".$queriedDisease."'</p>";


$stateArray = getOldGPOStateAbbreviations();
if( $isTest )
	echo "<p>".var_dump( $stateArray )."</p>";


$year = array_key_exists("year", $_GET) ? $_GET["year"] : $mostRecentMMWRYear;
$week = array_key_exists("week", $_GET) ? $_GET["week"] : $mostRecentMMWRWeek;

if( $isTest )
	echo "<p>Using year ".$year." and week number ".$week.".</p>";
	
if( $isTest )
	echo "<p>".var_dump( $MMWRDiseases )."</p>";

$d = $MMWRDiseases[ $queriedDisease ];
$t = $d[0];
$c = 2 + 5*($d[1] - 1);

if( $isTest )
	echo "<p>For disease '".$queriedDisease."' we will query table ".$t." and look to column number ".$c.".</p>";

$mmwrTableUrl = "http://wonder.cdc.gov/mmwr/mmwr_reps.asp?mmwr_year=".$year."&mmwr_week=".$week."&mmwr_table=".$t;

if( $isTest )
	echo "<p>About to request <a href='".$mmwrTableUrl."'>".$mmwrTableUrl."</a>.</p>";


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
	if( @array_key_exists( $stateAbbr, $stateArray ) ) {
		$casesThisWeek = $caseRow->branch()->find("td:eq(".$c.")")->text();
		if( $casesThisWeek == "-" || $casesThisWeek == "N" || $casesThisWeek == "NN" || $casesThisWeek == "U" )
			$casesThisWeek = 0;
		else
			$casesThisWeek = intval( $casesThisWeek );
		$illnessCases[ $stateArray[$stateAbbr] ] = $casesThisWeek;
	}
}
echo json_encode( $illnessCases );

