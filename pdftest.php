<?php
require "class.pdf2text.php";

echo "Loading http://www.michigan.gov/documents/mdch/...";

$pdfParse = new PDF2Text();
$pdfParse->setFilename("Current_WSR_272689_7.pdf"); // http://www.michigan.gov/documents/mdch/
$pdfParse->decodePDF();
$contents = $pdfParse->output();

echo $contents;

echo "no?";
