<?php

require 'QueryPath/QueryPath.php';
require 'StateAbbreviations.php';

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
	echo var_dump( $stateArray );

$mmwrTimeOptions = new DOMDocument();		
$mmwrTimeOptions->loadHTMLFile("http://wonder.cdc.gov/mmwr/mmwrmorb.asp");
$qpMmwrTimeOptions = qp($mmwrTimeOptions->saveHTML());

$yearPresent = $qpMmwrTimeOptions->branch()->find("select[name='mmwr_year'] option[selected]")->text();
$weekPresent = $qpMmwrTimeOptions->find("select[name='mmwr_week'] option[selected]")->text();

if( $isTest )
	echo "Using year ".$yearPresent." and week number ".$weekPresent.".<br />";

