function open() {
	$.earth.open();
	setTimeout(function () {
		var currentGPS = Ti.App.Properties.getObject('gps');
		Ti.API.info(JSON.stringify(currentGPS, null, 2));

		function onSuccessCallback(e) {
			var jsonStuff = JSON.parse(e.data);

			Ti.API.info(JSON.stringify(jsonStuff, null, 2));
			$.cityName.value = jsonStuff.list[0].name + ", " + jsonStuff.list[0].sys.country;
			Ti.App.Properties.setObject('currentWeather', jsonStuff.list[0]);
			Ti.App.Properties.setString('locationName', jsonStuff.list[0].name);
			Ti.App.Properties.setString('locationCountry', jsonStuff.list[0].sys.country);
		};

		function onErrorCallback(e) {
			Ti.API.error("Error in XHR" + JSON.stringify(e, null, 2));
		};
		var XHR = require("xhr");
		var xhr = new XHR();
		var cityLuURL = "http://api.openweathermap.org/data/2.5/find?";
		cityLuURL += "lat=" + currentGPS.lat;
		cityLuURL += "&lon=" + currentGPS.lon;

		// var cityLuURL = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+currentGPS.lat+","+currentGPS.lon+"&&sensor=true";

		Ti.API.warn(cityLuURL);
		
		xhr.get(cityLuURL, onSuccessCallback, onErrorCallback);
	}, 600);
}

function checkNextPass() {
	Ti.API.info("Checking the next Pass from location page");
	var currentGPS = Ti.App.Properties.getObject('gps');

	function onSuccessCallback(e) {
		var jsonStuff = JSON.parse(e.data);

		Ti.API.info(JSON.stringify(jsonStuff, null, 2));

		Ti.App.Properties.setObject('nextPasses', jsonStuff);
		$.earth.close();
		var earthIdleWin = Alloy.createController('earth_idle');
		earthIdleWin.open({
			trigger: 'list',
			data: jsonStuff
		});

	};


	function onErrorCallback(e) {
		Ti.API.error("Error in XHR" + e.error);
	};
	var XHR = require("xhr");
	var xhr = new XHR();
	// var issURL = "http://api.open-notify.org/iss/?";
	var issURL = "http://"+ Ti.App.Properties.getString("Settings_API_DOMAIN")+":"+Ti.App.Properties.getString("Settings_API_PORT")+"/passes?";

	issURL += "lat=" + currentGPS.lat;
	issURL += "&lon=" + currentGPS.lon;
	issURL += "&alt=" + currentGPS.alt;
	issURL += "&n=10";

	Ti.API.warn("ISS Pass lokup URL\n" + issURL);
	// var url = 'http:///add_event/' + $.cityName.value + '/' + (1 - $.cloudSlider.value) + "/" + $.buttonView.timeOfDay + "/" + Ti.App.Properties.getString('acsUserID');


	xhr.get(issURL, onSuccessCallback, onErrorCallback);



}




exports.open = open;