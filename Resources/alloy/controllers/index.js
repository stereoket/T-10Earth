function Controller() {
    function incrementAppLaunchCount() {
        var spCount = Ti.App.Properties.getInt("appLaunchCount");
        Ti.App.Properties.setInt("appLaunchCount", spCount += 1);
        log("DEBUG", "appLaunchCount:" + Ti.App.Properties.getInt("appLaunchCount"));
    }
    function checkSplashLaunch() {
        log("DEBUG", "Checking App Launch Count");
        incrementAppLaunchCount();
        Helper.isSimulator || push.activatePush();
    }
    function launchSpaceApp() {
        log("INFO", "Launching Space App");
        Ti.App.Properties.setString("appmode", "space");
        checkSplashLaunch();
        var spaceAlert = Ti.UI.createAlertDialog({
            title: "So you think you are in Space",
            buttonNames: [ "yes", "no" ],
            cancel: 1
        });
        spaceAlert.show();
    }
    function launchEarthApp() {
        log("INFO", "Launching Earth App");
        Ti.App.Properties.setString("appmode", "earth");
        checkSplashLaunch();
        earthWin = Alloy.createController("earth");
        earthWin.open();
        gps.getCurrentPosition({
            counter: 3
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundImage: Alloy.CFG.splashBackground,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.space = Ti.UI.createView({
        height: "28%",
        width: "80%",
        background: "blue",
        zIndex: 10,
        top: "10%",
        id: "space"
    });
    $.__views.index.add($.__views.space);
    launchSpaceApp ? $.__views.space.addEventListener("click", launchSpaceApp) : __defers["$.__views.space!click!launchSpaceApp"] = true;
    $.__views.earth = Ti.UI.createView({
        height: "28%",
        width: "80%",
        background: "blue",
        zIndex: 10,
        bottom: "10%",
        id: "earth"
    });
    $.__views.index.add($.__views.earth);
    launchEarthApp ? $.__views.earth.addEventListener("click", launchEarthApp) : __defers["$.__views.earth!click!launchEarthApp"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Helper = require("Helper");
    var log = Helper.log;
    var gps = require("gps");
    gps.setGPSpurpose();
    if (!Helper.isSimulator) var push = require("push_notification");
    Ti.App.Properties.setBool("allowPush", true);
    Ti.App.Properties.setInt("gpsCount", 0);
    setTimeout(function() {
        if (Ti.App.Properties.getInt("appLaunchCount") > 3) switch (Ti.App.Properties.getString("appmode")) {
          case "space":
            launchSpaceApp();
            break;

          case "earth":
            launchEarthApp();
        } else $.index.open();
    }, 1500);
    __defers["$.__views.space!click!launchSpaceApp"] && $.__views.space.addEventListener("click", launchSpaceApp);
    __defers["$.__views.earth!click!launchEarthApp"] && $.__views.earth.addEventListener("click", launchEarthApp);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;