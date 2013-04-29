/**
 * Helper
 */

/**
 * Platform Constants
 */

var ANDROID = (Ti.Platform.osname === "android")? true:false;
var IPHONE = (Ti.Platform.osname === "iphone")? true:false;
var IPAD = (Ti.Platform.osname === "ipad")? true:false;
var BLACKBERRY = (Ti.Platform.osname === "blackberry")? true:false;
var logMode = "verbose";
var device = Ti.Platform.osname;



/**
 * system wide Log utility that can be switched on / off in the config.
 * logMode controls how the method call behaves. Pass in quiet and all the logs
 * are not sent to the Titanium log API. info selects a single level.
 * @param  {String} level   The log level WARN, INFO, DEBUG, ERROR (or custom).
 * @param  {String} message Description string that gets passed to the API log
 * @return {bool}
 */

function log(level, message) {
	"use strict";
	var msg;
	try {
		msg = "\t\t***** " + message + ' ***** ';
		// Add your own custom log levels to the switch
		switch (logMode) {
			case 'quiet':
				if (level === 'DEBUG' || level === 'WARN' || level === 'INFO') {
					return;
				}
				break;
			case 'info':
				if (level !== 'INFO') {
					return;
				}
				break;
			case 'debug':
				if (level !== 'DEBUG') {
					return;
				}
				break;
			case 'warn':
				if (level !== 'WARN') {
					return;
				}
				break;
			case 'verbose':

				break;

		}

		Ti.API.log(level, msg);
	} catch (err) {
		Ti.API.error('Could not trigger the log method' + err.message);
	}
	return true;
}

function isSimulator() {
	if (Ti.Platform.model === 'Simulator') {
		log("warn", '  Simulator Detected  ');
		return true;
	} else {
		return false;
	}
}

exports.log = log;
exports.isSimulator = isSimulator;
exports.device = device;
exports.ANDROID = ANDROID;
exports.IPHONE = IPHONE;
exports.IPAD = IPAD;
exports.BLACKBERRY = BLACKBERRY;