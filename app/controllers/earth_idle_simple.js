function open(){
	$.earth_idle_simple.open();
	var strftime = require("dateFormat").strftime;
	
	var currWeather = Ti.App.Properties.getObject('currentWeather');
	var nextPasses = Ti.App.Properties.getObject('nextPasses');
	var weatherIcon = "http://openweathermap.org/img/w/" + currWeather.weather[0].icon;
	$.weatherIcon.image = weatherIcon;
	$.location.text = "City: " + currWeather.name;

	var issDateTime = parseInt(nextPasses.response[0].risetime);
	var issStartTime = new Date(issDateTime * 1000);
	
	var startDate = strftime(issStartTime, "%m,/%d/%y");
	$.location.text += " " + startDate;

	var startTime = strftime(issStartTime, "%R");

	var issEndTime = new Date((issDateTime + nextPasses.response[0].duration) * 1000);
	var endTime = strftime(issEndTime, "%R");

	var timeSpan = startTime + " - " + endTime;

	$.timezone.text += " " + timeSpan;



}
function seeMore(){
	$.earth_idle_simple.close();
}


// http://openweathermap.org/img/w/10d.png

exports.open = open;