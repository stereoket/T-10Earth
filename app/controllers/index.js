var Helper = require('Helper');
var log = Helper.log;
var gps = require('gps');
	gps.setGPSpurpose();
if (!Helper.isSimulator) {
	var push = require('push_notification');
}
Ti.App.Properties.setBool('allowPush', true);
Ti.App.Properties.setInt('gpsCount', 0);

function incrementAppLaunchCount() {
	var spCount = Ti.App.Properties.getInt('appLaunchCount');

	Ti.App.Properties.setInt('appLaunchCount', spCount += 1);
	log("DEBUG", "appLaunchCount:" + Ti.App.Properties.getInt('appLaunchCount'));
}

function checkSplashLaunch() {
	log("DEBUG", "Checking App Launch Count");
	// Check persData for previous launch
	incrementAppLaunchCount();
	/**
	 * Only activate push notice sequence and login if not on sim (testing only)
	 */
	if (!Helper.isSimulator) {
		push.activatePush();
	}



}

function launchSpaceApp() {
	log("INFO", "Launching Space App");
	Ti.App.Properties.setString('appmode', 'space');
	checkSplashLaunch();
	var spaceAlert = Ti.UI.createAlertDialog({
		title: "So you think you are in Space",
		buttonNames: ["yes", "no"],
		cancel: 1
	});
	spaceAlert.show();

	// SETUP SWIPE GESTURES
	// 
}

function launchEarthApp() {
	log("INFO", "Launching Earth App");
	Ti.App.Properties.setString('appmode', 'earth');
	checkSplashLaunch();
	earthWin = Alloy.createController('earth');
	earthWin.open();

	gps.getCurrentPosition({
		counter: 3
	});

}

function getGPS() {

}
// Check index launch value, leave a small gap before launching the main window - so splash screen has some visibility
setTimeout(function () {
	if (Ti.App.Properties.getInt('appLaunchCount') > 3) {
		var earthWin;
		switch (Ti.App.Properties.getString('appmode')) {
			case 'space':
				launchSpaceApp();
				break;

			case 'earth':
				launchEarthApp();
				break;
		}
	} else {

		$.index.open();


	}
}, 1500);