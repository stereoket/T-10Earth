/**
 * GPS module, determines location and passes data back to app to narrow down GPS
 * position.
 * @return {object} GPS lat /long
 */

/**
 * Sets the purpose for all iOS 3.2+ devices
 */
exports.setGPSpurpose = function () {
	if (exports.isIPhone3_2_Plus() && !Ti.Geolocation.purpose) {
		Ti.Geolocation.purpose = "SCI-FI-LONDON Find Locations";
	}
};

exports.isIPhone3_2_Plus = function () {

	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Ti.Platform.version.split(".");
		var major = parseInt(version[0]);
		var minor = parseInt(version[1]);

		// can only test this support on a 3.2+ device
		if (major > 3 || (major == 3 && minor > 1)) {
			return true;
		}
	}
	return false;
};
exports.isiOS4Plus = function () {
	// add iphone specific tests
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0]);

		// can only test this support on a 3.2+ device
		if (major >= 4) {
			return true;
		}
	}
	return false;
};

exports.customGPSalert = function () {
	if (Ti.Geolocation.locationServicesEnabled == false) {
		Titanium.UI.createAlertDialog({
			title: 'T-10 Earth',
			message: 'Your device has geo turned off - turn it on, if you want the route service to work.'
		}).show();
	} else {
		if (Titanium.Platform.name !== 'android') {
			var authorization = Titanium.Geolocation.locationServicesAuthorization;
			Ti.API.info('Authorization: ' + authorization);
			if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
				Ti.UI.createAlertDialog({
					title: 'T10 Earth',
					message: 'You have disallowed the app from running geolocation services.'
				}).show();
			} else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
				Ti.UI.createAlertDialog({
					title: 'T-10 Earth',
					message: 'Your system has disallowed the app from running geolocation services.'
				}).show();
			}
		}
	}
};
exports.currentPositionListener = function (e) {
	Ti.API.warn('current position listener');
	// GeoLoc.getCurrentLocation();
	if (!e.success || e.error) {
		Ti.API.error(JSON.stringify(e.error));
		var longitude = '';
		var latitude = '';
		var latlong = '';
		return;
	}

	var timestamp = e.coords.timestamp;
	var provider = e.provider;

	Ti.API.debug(Ti.Geolocation.PROVIDER_GPS);

	Ti.API.info(e.success);
	Ti.API.info(e.source);
	Ti.API.info(e.type);

	if (e.success) {
		Ti.API.info(JSON.stringify(e.coords, null, 2));
		Ti.App.Properties.setObject('gps', {
			lat: e.coords.latitude,
			lon: e.coords.longitude,
			acc: e.coords.accuracy,
			alt: e.coords.altitude,
			head: e.coords.heading,
			prov: e.provider
		});
	}

	var gpsTimeout = setTimeout(function (e) {
		Ti.API.debug('location timeout function');
		var geoTimeout = 1;
		Ti.App.Properties.setInt('gpsCount', 0);
		exports.removePositionListener
	}, 300);

};
/**
 * Fires off the GPS sensor to get the current location - lat/long
 */
exports.getCurrentPosition = function (_params) {
	var gpsCount = Ti.App.Properties.getInt('gpsCount');
	Ti.API.warn('GPS COunt: ' + gpsCount);
	Ti.API.warn('GPS Params: ' + _params.counter);
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.preferredProvider = "gps";
	Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.headingFilter = 1;
	Ti.Geolocation.showCalibration = true;
	Ti.Geolocation.distanceFilter = 0;
	Ti.Geolocation.frequency = 1;
	// android specific ?

	//
	// GET CURRENT POSITION - THIS FIRES ONCE
	//
	Ti.Geolocation.getCurrentPosition(function (e) {
		Ti.API.warn('GPS Current POSITION: ' + _params.counter);
		if (e.error) {
			Ti.API.error('GPS getCurrentPosition ERROR ' + JSON.stringify(e));
			return;
		}
		if (e.success) {
			gpsCount++;
			Ti.App.Properties.setInt('gpsCount', gpsCount);
			Ti.App.Properties.setObject('gps', {
				lat: e.coords.latitude,
				lon: e.coords.longitude,
				acc: e.coords.accuracy,
				alt: e.coords.altitude,
				head: e.coords.heading,
				prov: e.provider
			});
			

		}
	});
	if (_params.counter < Ti.App.Properties.getInt('gpsCount')) {
		Ti.App.Properties.setInt('gpsCount', 0)
		Ti.API.debug('location listener activated');
		Ti.Geolocation.addEventListener('location', exports.currentPositionListener);
	}
};
exports.removePositionListener = function () {
	Ti.Geolocation.removeEventListener('location', exports.currentPositionListener);
	Ti.API.debug('Removing listener');
	return null;
};
exports.checkGPSactivity = function () {

}