function Controller() {
    function open() {
        $.earth.open();
        setTimeout(function() {
            function onSuccessCallback(e) {
                var jsonStuff = JSON.parse(e.data);
                Ti.API.info(JSON.stringify(jsonStuff, null, 2));
                $.cityName.value = jsonStuff.list[0].name + ", " + jsonStuff.list[0].sys.country;
                Ti.App.Properties.setObject("currentWeather", jsonStuff.list[0]);
                Ti.App.Properties.setString("locationName", jsonStuff.list[0].name);
                Ti.App.Properties.setString("locationCountry", jsonStuff.list[0].sys.country);
            }
            function onErrorCallback(e) {
                Ti.API.error("Error in XHR" + JSON.stringify(e, null, 2));
            }
            var currentGPS = Ti.App.Properties.getObject("gps");
            Ti.API.info(JSON.stringify(currentGPS, null, 2));
            var XHR = require("xhr");
            var xhr = new XHR();
            var cityLuURL = "http://api.openweathermap.org/data/2.5/find?";
            cityLuURL += "lat=" + currentGPS.lat;
            cityLuURL += "&lon=" + currentGPS.lon;
            Ti.API.warn(cityLuURL);
            xhr.get(cityLuURL, onSuccessCallback, onErrorCallback);
        }, 600);
    }
    function checkNextPass() {
        function onSuccessCallback(e) {
            var jsonStuff = JSON.parse(e.data);
            Ti.API.info(JSON.stringify(jsonStuff, null, 2));
            Ti.App.Properties.setObject("nextPasses", jsonStuff);
            $.earth.close();
            var earthIdleWin = Alloy.createController("earth_idle");
            earthIdleWin.open({
                trigger: "list",
                data: jsonStuff
            });
        }
        function onErrorCallback(e) {
            Ti.API.error("Error in XHR" + e.error);
        }
        Ti.API.info("Checking the next Pass from location page");
        var currentGPS = Ti.App.Properties.getObject("gps");
        var XHR = require("xhr");
        var xhr = new XHR();
        var issURL = "http://" + Ti.App.Properties.getString("Settings_API_DOMAIN") + ":" + Ti.App.Properties.getString("Settings_API_PORT") + "/passes?";
        issURL += "lat=" + currentGPS.lat;
        issURL += "&lon=" + currentGPS.lon;
        issURL += "&alt=" + currentGPS.alt;
        issURL += "&n=10";
        Ti.API.warn("ISS Pass lokup URL\n" + issURL);
        xhr.get(issURL, onSuccessCallback, onErrorCallback);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.earth = Ti.UI.createWindow({
        backgroundImage: Alloy.CFG.backgroundImage,
        id: "earth"
    });
    $.__views.earth && $.addTopLevelView($.__views.earth);
    $.__views.winTitle = Ti.UI.createLabel({
        font: {
            fontSize: 36,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        textAlign: "center",
        color: "#fff",
        width: Ti.UI.SIZE,
        shadowColor: "#000",
        shadowOffset: {
            x: 2,
            y: 1
        },
        top: 10,
        height: Ti.UI.SIZE,
        zIndex: 10,
        text: "We think you are in...",
        id: "winTitle"
    });
    $.__views.earth.add($.__views.winTitle);
    $.__views.__alloyId0 = Ti.UI.createView({
        id: "__alloyId0"
    });
    $.__views.earth.add($.__views.__alloyId0);
    $.__views.cityName = Ti.UI.createTextField({
        top: 60,
        left: 10,
        height: Ti.UI.SIZE,
        color: Alloy.CFG.citySearchColor,
        right: 10,
        paddingRight: 40,
        zIndex: 100,
        textAlign: "center",
        backgroundColour: "transparent",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 30
        },
        id: "cityName",
        hintText: "Your City"
    });
    $.__views.__alloyId0.add($.__views.cityName);
    $.__views.refreshGPS = Ti.UI.createImageView({
        id: "refreshGPS",
        image: "/images/71-compass.png",
        width: "24",
        height: "24",
        right: "15",
        top: "64"
    });
    $.__views.__alloyId0.add($.__views.refreshGPS);
    $.__views.locationOptions = Ti.UI.createView({
        top: 110,
        height: Ti.UI.SIZE,
        left: 5,
        right: 5,
        zIndex: 10,
        id: "locationOptions"
    });
    $.__views.earth.add($.__views.locationOptions);
    $.__views.__alloyId1 = Ti.UI.createView({
        left: "10",
        backgroundImage: "/images/58-todo.png",
        width: "16",
        height: "13",
        id: "__alloyId1"
    });
    $.__views.locationOptions.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        font: {
            fontSize: 16,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        textAlign: "center",
        color: "#fff",
        width: Ti.UI.SIZE,
        shadowColor: "#000",
        shadowOffset: {
            x: 2,
            y: 1
        },
        text: "Set as default",
        left: "30",
        id: "__alloyId2"
    });
    $.__views.locationOptions.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createButton({
        font: {
            fontSize: 16,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        width: Ti.UI.SIZE,
        color: "#000",
        shadowColor: "#000",
        shadowOffset: {
            x: 2,
            y: 1
        },
        title: "Change Location",
        backgroundImage: "/images/blueButton.png",
        height: "44",
        right: "5",
        id: "__alloyId3"
    });
    $.__views.locationOptions.add($.__views.__alloyId3);
    $.__views.reminderSettings = Ti.UI.createView({
        top: 180,
        left: 0,
        right: 0,
        height: Ti.UI.SIZE,
        id: "reminderSettings"
    });
    $.__views.earth.add($.__views.reminderSettings);
    $.__views.reminderWidget = Alloy.createWidget("to.t10.reminderSettings", "widget", {
        id: "reminderWidget",
        __parentSymbol: $.__views.reminderSettings
    });
    $.__views.reminderWidget.setParent($.__views.reminderSettings);
    $.__views.nextPass = Ti.UI.createButton({
        top: 280,
        color: "#fff",
        font: {
            fontSize: 16,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        title: "OK",
        id: "nextPass",
        right: "40",
        width: "60",
        height: "60",
        backgroundImage: "/images/blueButton.png"
    });
    $.__views.earth.add($.__views.nextPass);
    checkNextPass ? $.__views.nextPass.addEventListener("click", checkNextPass) : __defers["$.__views.nextPass!click!checkNextPass"] = true;
    $.__views.loggedInStatus = Ti.UI.createView({
        backgroundColor: "#fff",
        opacity: .6,
        id: "loggedInStatus",
        bottom: "0",
        height: "33"
    });
    $.__views.earth.add($.__views.loggedInStatus);
    $.__views.loggedLabel = Ti.UI.createLabel({
        font: {
            fontSize: 16,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        textAlign: "center",
        color: "#000",
        width: Ti.UI.SIZE,
        text: "Logged in as:",
        left: "5",
        height: Ti.UI.FILL,
        top: "0",
        id: "loggedLabel"
    });
    $.__views.loggedInStatus.add($.__views.loggedLabel);
    $.__views.loggedLabel = Ti.UI.createLabel({
        font: {
            fontSize: 16,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        textAlign: "center",
        color: "#000",
        width: Ti.UI.SIZE,
        text: "Anonymous",
        left: "100",
        height: Ti.UI.FILL,
        top: "0",
        id: "loggedLabel"
    });
    $.__views.loggedInStatus.add($.__views.loggedLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.open = open;
    __defers["$.__views.nextPass!click!checkNextPass"] && $.__views.nextPass.addEventListener("click", checkNextPass);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;