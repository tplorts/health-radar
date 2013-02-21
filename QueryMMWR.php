<?php

require 'QueryPath/QueryPath.php';
require 'StateAbbreviations.php';

libxml_use_internal_errors( true );

$isTest = ( array_key_exists("test", $_GET) );
if( $isTest )
	echo "<p>This is a test.</p>";
else {

	if( $isTest && !array_key_exists("diseaseName", $_GET) )
		$queriedDisease = "Chlamydia trachomatis infection";
	else
		$queriedDisease = $_GET["diseaseName"];
		
	echo $queriedDisease;
}
