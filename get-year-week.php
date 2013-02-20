<?php

require 'QueryPath/QueryPath.php';
libxml_use_internal_errors( true );

$doc = new DOMDocument();		
$doc->loadHTMLFile("http://wonder.cdc.gov/mmwr/mmwrmorb.asp");
$qp = qp($doc->saveHTML());

echo $qp->branch()->find("select[name='mmwr_year'] option[selected]")->text();
echo $qp->branch()->find("select[name='mmwr_week'] option[selected]")->text();

?>
