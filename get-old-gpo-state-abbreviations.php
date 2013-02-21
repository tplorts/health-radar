<?php

require 'QueryPath/QueryPath.php';
//libxml_use_internal_errors( true );
ini_set('display_errors', 'On');

require 'StateAbbreviations.php';

echo json_encode( getOldGPOStateAbbreviations() );
