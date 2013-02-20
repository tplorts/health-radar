<?php

require 'QueryPath/QueryPath.php';
//libxml_use_internal_errors( true );
ini_set('display_errors', 'On');


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

echo json_encode( getOldGPOStateAbbreviations() );
