function open(e) {
	Ti.API.warn("Earth Idle SCreen launched");

	Ti.API.warn(JSON.stringify(e, null, 2));
	$.cityName.text = Ti.App.Properties.getString('locationName');

	$.earth_idle.addEventListener("swipe", function (e) {
		// Ti.API.warn(JSON.stringify(e, null, 2));
		if (e.direction === "right" && e.source.id === "earth_idle" && e.y < 90) {
			earthWin = Alloy.createController('earth');
			setTimeout(function () {
				earthWin.open();
				$.earth_idle.close();
			}, 50);
		}
	});


	// var issPassCount = e.data.request.passes; // used for open notify
	var issPassCount = e.data.response.length; // used for our server

	Ti.API.warn(issPassCount + " entries");

	$.earth_idle.open();

	var strftime = require("dateFormat").strftime;

	for (var i = 0; i < issPassCount; i++) {
		var issCtrl = Alloy.createController('iss_list_tpl');
		var issList = issCtrl.getView();

		Ti.API.warn("*** data for this ISS pass ***");

		Ti.API.debug(JSON.stringify(e.data.response[i], null, 2));
		var issDateTime = parseInt(e.data.response[i].risetime);
		var issDate = new Date(issDateTime * 1000);

		// Date Formatting
		var dayString = strftime(issDate, "%A %d");
		var day = issCtrl.getView('day');
		day.text = dayString;
		var timeString = strftime(issDate, "%R");
		var time = issCtrl.getView('time');
		time.text = timeString;
		issList.top = (i * 70);

		// Add Pass View intoscroll container
		$.issListContainer.add(issList);
		Ti.API.warn("*** Adding ISS Pass data into List view ***");
	};


}

function seeLess(){
	var simpleIdle = Alloy.createController("earth_idle_simple");
	simpleIdle.open();
}


exports.open = open;
exports.seeLess = seeLess;