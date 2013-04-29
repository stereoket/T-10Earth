function Controller() {
    function open() {
        $.earth_idle_simple.open();
        var strftime = require("dateFormat").strftime;
        var currWeather = Ti.App.Properties.getObject("currentWeather");
        var nextPasses = Ti.App.Properties.getObject("nextPasses");
        var weatherIcon = "http://openweathermap.org/img/w/" + currWeather.weather[0].icon;
        $.weatherIcon.image = weatherIcon;
        $.location.text = "City: " + currWeather.name;
        var issDateTime = parseInt(nextPasses.response[0].risetime);
        var issStartTime = new Date(1e3 * issDateTime);
        var startDate = strftime(issStartTime, "%m,/%d/%y");
        $.location.text += " " + startDate;
        var startTime = strftime(issStartTime, "%R");
        var issEndTime = new Date(1e3 * (issDateTime + nextPasses.response[0].duration));
        var endTime = strftime(issEndTime, "%R");
        var timeSpan = startTime + " - " + endTime;
        $.timezone.text += " " + timeSpan;
    }
    function seeMore() {
        $.earth_idle_simple.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.earth_idle_simple = Ti.UI.createWindow({
        modal: true,
        navBarHidden: true,
        backgroundImage: Alloy.CFG.backgroundImage,
        id: "earth_idle_simple"
    });
    $.__views.earth_idle_simple && $.addTopLevelView($.__views.earth_idle_simple);
    $.__views.mainGraphic = Ti.UI.createView({
        id: "mainGraphic"
    });
    $.__views.earth_idle_simple.add($.__views.mainGraphic);
    $.__views.infoPanel = Ti.UI.createView({
        bottom: 50,
        height: 130,
        id: "infoPanel"
    });
    $.__views.earth_idle_simple.add($.__views.infoPanel);
    $.__views.nextPass = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichBlack,
            fontSize: 18
        },
        textAlign: "left",
        height: 20,
        left: 20,
        top: 15,
        text: "Next Pass",
        id: "nextPass"
    });
    $.__views.infoPanel.add($.__views.nextPass);
    $.__views.location = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 18
        },
        textAlign: "left",
        height: 15,
        left: 20,
        top: 40,
        text: "City",
        id: "location"
    });
    $.__views.infoPanel.add($.__views.location);
    $.__views.timezone = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 18
        },
        textAlign: "left",
        height: 15,
        left: 20,
        top: 60,
        text: "GMT +1",
        id: "timezone"
    });
    $.__views.infoPanel.add($.__views.timezone);
    $.__views.alerts = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 18
        },
        textAlign: "left",
        height: 15,
        left: 20,
        top: 80,
        text: "Alerts Off",
        id: "alerts"
    });
    $.__views.infoPanel.add($.__views.alerts);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 18
        },
        textAlign: "left",
        height: 15,
        left: 20,
        id: "__alloyId4"
    });
    $.__views.infoPanel.add($.__views.__alloyId4);
    $.__views.weatherIcon = Ti.UI.createImageView({
        right: 20,
        bottom: 20,
        width: 100,
        height: 80,
        id: "weatherIcon"
    });
    $.__views.infoPanel.add($.__views.weatherIcon);
    $.__views.idleMode = Ti.UI.createView({
        bottom: 0,
        height: 50,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        opacity: .6,
        id: "idleMode"
    });
    $.__views.earth_idle_simple.add($.__views.idleMode);
    seeMore ? $.__views.idleMode.addEventListener("click", seeMore) : __defers["$.__views.idleMode!click!seeMore"] = true;
    $.__views.seeMore = Ti.UI.createLabel({
        color: "#000",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 36
        },
        textAlign: "center",
        text: "Show More",
        id: "seeMore"
    });
    $.__views.idleMode.add($.__views.seeMore);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.open = open;
    __defers["$.__views.idleMode!click!seeMore"] && $.__views.idleMode.addEventListener("click", seeMore);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;