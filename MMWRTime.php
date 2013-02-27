<?php

require 'QueryPath/QueryPath.php';
libxml_use_internal_errors( true );
//ini_set('display_errors', 'Off');

$MMWRTimeDoc = new DOMDocument();		
$MMWRTimeDoc->loadHTMLFile("http://wonder.cdc.gov/mmwr/mmwrmorb.asp");
$MMWRTimeQP = qp($MMWRTimeDoc->saveHTML());

$mostRecentMMWRYear = intval( $MMWRTimeQP->branch()->find("select[name='mmwr_year'] option[selected]")->text() );
$mostRecentMMWRWeek = intval( $MMWRTimeQP->branch()->find("select[name='mmwr_week'] option[selected]")->text() );

/*
function mostRecentMMWRYear() {
	return intval( $MMWRTimeQP->branch()->find("select[name='mmwr_year'] option[selected]")->text() );
}

function mostRecentMMWRWeek() {
	return intval( $MMWRTimeQP->branch()->find("select[name='mmwr_week'] option[selected]")->text() );
}
*/
