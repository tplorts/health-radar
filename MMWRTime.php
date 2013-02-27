<?php

require_once 'QueryPath/QueryPath.php';
libxml_use_internal_errors( true );

$MMWRTimeDoc = new DOMDocument();		
$MMWRTimeDoc->loadHTMLFile("http://wonder.cdc.gov/mmwr/mmwrmorb.asp");
$MMWRTimeQP = qp($MMWRTimeDoc->saveHTML());

$mostRecentMMWRYear = intval( $MMWRTimeQP->branch()->find("select[name='mmwr_year'] option[selected]")->text() );
$mostRecentMMWRWeek = intval( $MMWRTimeQP->branch()->find("select[name='mmwr_week'] option[selected]")->text() );
