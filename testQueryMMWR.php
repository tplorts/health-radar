<?php

require 'QueryPath/QueryPath.php';
require 'StateAbbreviations.php';
require 'MMWRTableInfo.php';

libxml_use_internal_errors( true );

echo "<p>This is a test.</p>";

if( !array_key_exists("diseaseName", $_GET) )
	$queriedDisease = "Chlamydia trachomatis infection";
else
	$queriedDisease = $_GET["diseaseName"];

echo "<p>Disease: '".$queriedDisease."'</p>";


$stateArray = getOldGPOStateAbbreviations();
echo "<p>".var_dump( $stateArray )."</p>";


$mmwrTimeOptions = new DOMDocument();		
$mmwrTimeOptions->loadHTMLFile("http://wonder.cdc.gov/mmwr/mmwrmorb.asp");
$qpMmwrTimeOptions = qp($mmwrTimeOptions->saveHTML());

$yearPresent = $qpMmwrTimeOptions->branch()->find("select[name='mmwr_year'] option[selected]")->text();
$weekPresent = $qpMmwrTimeOptions->find("select[name='mmwr_week'] option[selected]")->text();

echo "<p>Using year ".$yearPresent." and week number ".$weekPresent.".</p>";
	
echo "<p>".var_dump( $diseaseTableIds )."</p>";

$d = $diseaseTableIds[ $queriedDisease ];
$t = $d[0];
$c = 2 + 5*($d[1] - 1);

echo "<p>For disease '".$queriedDisease."' we will query table ".$t." and look to column number ".$c.".</p>";

$mmwrTableUrl = "http://wonder.cdc.gov/mmwr/mmwr_reps.asp?mmwr_year=".$yearPresent."&mmwr_week=".$weekPresent."&mmwr_table=".$t;

echo "<p>About to request <a href='".$mmwrTableUrl."'>".$mmwrTableUrl."</a>.</p>";


$doc = new DOMDocument();		
$doc->loadHTMLFile($mmwrTableUrl);
$qpMMWR = qp($doc->saveHTML());
$qpMMWRTable = $qpMMWR->find("table:eq(8)");

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

