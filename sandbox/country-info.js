
var countryInfo;

function updateCountryInfo() {

	countryXML = fetchCountyXML();
	var geonames = $(countryXML.documentElement);
	countryInfo = {};
	var countryObjects = geonames.children("country");
	for( i = 0; i < countryObjects.length; i++ ) {
		var thisCountry = $(countryObjects[i]);
		var countryCode = thisCountry.find("isoAlpha3").text();
		var north = parseFloat( thisCountry.find("north").text() );
		var south = parseFloat( thisCountry.find("south").text() );
		var east = parseFloat( thisCountry.find("east").text() );
		var west = parseFloat( thisCountry.find("west").text() );
		countryInfo[countryCode] = {
			latitude: (north - south)/2 + south,
			longitude: (east - west)/2 + west
			//name: thisCountry.find("countryName").text();
		}
		
		//test it
		//$("body").append($("<p />", {text:countryCode+": "+countryInfo[countryCode].latitude+", "+countryInfo[countryCode].longitude}));
	}
	
	return countryInfo;
}



function fetchCountyXML() {
	var remote = 'http://ws.geonames.org/countryInfo';
	var locallocation = 'file:///C:/xampp/htdocs/health-radar/';
	var filename = 'countryInfo.xml';
	var specRequest = new XMLHttpRequest();
	specRequest.open( "GET", remote, false );
	specRequest.send();
	return specRequest.responseXML;
}
