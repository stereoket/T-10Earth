function Controller() {
    function open(e) {
        Ti.API.warn("Earth Idle SCreen launched");
        Ti.API.warn(JSON.stringify(e, null, 2));
        $.cityName.text = Ti.App.Properties.getString("locationName");
        $.earth_idle.addEventListener("swipe", function(e) {
            if ("right" === e.direction && "earth_idle" === e.source.id && 90 > e.y) {
                earthWin = Alloy.createController("earth");
                setTimeout(function() {
                    earthWin.open();
                    $.earth_idle.close();
                }, 50);
            }
        });
        var issPassCount = e.data.response.length;
        Ti.API.warn(issPassCount + " entries");
        $.earth_idle.open();
        var strftime = require("dateFormat").strftime;
        for (var i = 0; issPassCount > i; i++) {
            var issCtrl = Alloy.createController("iss_list_tpl");
            var issList = issCtrl.getView();
            Ti.API.warn("*** data for this ISS pass ***");
            Ti.API.debug(JSON.stringify(e.data.response[i], null, 2));
            var issDateTime = parseInt(e.data.response[i].risetime);
            var issDate = new Date(1e3 * issDateTime);
            var dayString = strftime(issDate, "%A %d");
            var day = issCtrl.getView("day");
            day.text = dayString;
            var timeString = strftime(issDate, "%R");
            var time = issCtrl.getView("time");
            time.text = timeString;
            issList.top = 70 * i;
            $.issListContainer.add(issList);
            Ti.API.warn("*** Adding ISS Pass data into List view ***");
        }
    }
    function seeLess() {
        var simpleIdle = Alloy.createController("earth_idle_simple");
        simpleIdle.open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.earth_idle = Ti.UI.createWindow({
        backgroundImage: Alloy.CFG.backgroundImage,
        id: "earth_idle"
    });
    $.__views.earth_idle && $.addTopLevelView($.__views.earth_idle);
    $.__views.cityName = Ti.UI.createLabel({
        top: 10,
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 22
        },
        textAlign: "center",
        touchEnabled: false,
        backgroundColor: "transparent",
        height: 24,
        text: "You are in",
        id: "cityName"
    });
    $.__views.earth_idle.add($.__views.cityName);
    $.__views.issListContainer = Ti.UI.createScrollView({
        top: 44,
        height: 146,
        opacity: .9,
        id: "issListContainer"
    });
    $.__views.earth_idle.add($.__views.issListContainer);
    $.__views.reminderSettings = Ti.UI.createView({
        top: 206,
        left: 0,
        right: 0,
        height: Ti.UI.SIZE,
        id: "reminderSettings"
    });
    $.__views.earth_idle.add($.__views.reminderSettings);
    $.__views.reminderWidget = Alloy.createWidget("to.t10.reminderSettings", "widget", {
        id: "reminderWidget",
        __parentSymbol: $.__views.reminderSettings
    });
    $.__views.reminderWidget.setParent($.__views.reminderSettings);
    $.__views.buttonLayer = Ti.UI.createView({
        top: 310,
        height: 60,
        id: "buttonLayer"
    });
    $.__views.earth_idle.add($.__views.buttonLayer);
    $.__views.settingsButton = Ti.UI.createButton({
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium
        },
        top: 0,
        height: 60,
        width: 60,
        left: 40,
        backgroundImage: "/images/blueButton.png",
        title: "Settings",
        id: "settingsButton"
    });
    $.__views.buttonLayer.add($.__views.settingsButton);
    $.__views.helpButton = Ti.UI.createButton({
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium
        },
        top: 0,
        height: 60,
        width: 60,
        right: 40,
        backgroundImage: "/images/blueButton.png",
        title: "Help",
        id: "helpButton"
    });
    $.__views.buttonLayer.add($.__views.helpButton);
    $.__views.loggedStatus = Ti.UI.createLabel({
        bottom: 50,
        height: 28,
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 18
        },
        textAlign: "center",
        text: "Logged in as: Anonymous",
        id: "loggedStatus"
    });
    $.__views.earth_idle.add($.__views.loggedStatus);
    $.__views.idleMode = Ti.UI.createView({
        bottom: 0,
        height: 50,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        opacity: .6,
        id: "idleMode"
    });
    $.__views.earth_idle.add($.__views.idleMode);
    seeLess ? $.__views.idleMode.addEventListener("click", seeLess) : __defers["$.__views.idleMode!click!seeLess"] = true;
    $.__views.seeLess = Ti.UI.createLabel({
        color: "#000",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 36
        },
        textAlign: "center",
        text: "See Less",
        id: "seeLess"
    });
    $.__views.idleMode.add($.__views.seeLess);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.open = open;
    exports.seeLess = seeLess;
    __defers["$.__views.idleMode!click!seeLess"] && $.__views.idleMode.addEventListener("click", seeLess);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;