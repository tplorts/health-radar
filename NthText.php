<?php

function NthText( $n ) {
	$special = array( "", "st", "nd", "rd" );
	$ones = $n % 10;
	$tens = ($n / 10) % 10;
	if( $tens == 1 || $ones == 0 || $ones > 3 )
		return "th";
	return $special[$ones];
}
/* for( $i = 1; $i <= 52; $i++ ) echo " " . $i . "<sup>" . NthText($i) . "</sup>"; */
