
var malariaData;

function updateMalariaData( pMap, pCountryData, malariaXML ) {

	var caseElements = $(malariaXML.documentElement).find("Data Observation");
	malariaData = {};
	for( i = 0; i < caseElements.length; i++ ) {
		var thisCase = $(caseElements[i]);
		dimCountry = thisCase.find("Dim[Category='COUNTRY']");
		dimYear = thisCase.find("Dim[Category='YEAR']");
		var countryCode = dimCountry.attr("Code");
		var thisQuantity = parseFloat( thisCase.find("Value").attr("Numeric") );
		var thisYear = parseInt( dimYear.attr("Code") );
		
		if( countryCode in malariaData && malariaData[countryCode].year > thisYear )
			// If there exists an entry for this country which is more recent, then 
			// keep the more recent one.
			continue;
		
		malariaData[countryCode] = {
			numberCases: thisQuantity,
			year: thisYear
		}
		
		country = pCountryData[countryCode];
		placeCircleMarker( pMap, country.latitude, country.longitude, thisQuantity/10 );
	}
	
	return malariaData;
}

//function updateMalariaData( pMap, pCountryData ) {
//	updateMalariaData( pMap, pCountryData, fetchMalariaXML() );
//}

function fetchMalariaXML() {
	var request = new XMLHttpRequest();
	request.open( "GET", "http://apps.who.int/gho/athena/data/GHO/WHS3_48.xml?filter=COUNTRY:*", false );
	request.send();
	return request.responseXML;
}