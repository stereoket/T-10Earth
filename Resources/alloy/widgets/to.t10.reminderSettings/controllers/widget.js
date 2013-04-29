function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "to.t10.reminderSettings/" + s : s.substring(0, index) + "/to.t10.reminderSettings/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function openReminderSettings() {
        var reminderPreferences = require("reminderPrefs");
        reminderPreferences.open();
    }
    new (require("alloy/widget"))("to.t10.reminderSettings");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.reminderControls = Ti.UI.createView({
        id: "reminderControls"
    });
    $.__views.reminderControls && $.addTopLevelView($.__views.reminderControls);
    $.__views.reminderSwitchView = Ti.UI.createView({
        top: 0,
        left: 20,
        right: 20,
        height: 40,
        id: "reminderSwitchView"
    });
    $.__views.reminderControls.add($.__views.reminderSwitchView);
    $.__views.reminderSwitchLabel = Ti.UI.createLabel({
        font: {
            fontSize: 16,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        width: Ti.UI.SIZE,
        color: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            x: 2,
            y: 1
        },
        left: 10,
        text: "Reminder",
        id: "reminderSwitchLabel"
    });
    $.__views.reminderSwitchView.add($.__views.reminderSwitchLabel);
    $.__views.reminderSwitch = Ti.UI.createSwitch({
        right: 10,
        value: "false",
        id: "reminderSwitch"
    });
    $.__views.reminderSwitchView.add($.__views.reminderSwitch);
    $.__views.reminderSettingsView = Ti.UI.createView({
        top: 50,
        left: 20,
        right: 20,
        height: 40,
        id: "reminderSettingsView"
    });
    $.__views.reminderControls.add($.__views.reminderSettingsView);
    $.__views.reminderSettingsLabel = Ti.UI.createLabel({
        font: {
            fontSize: 16,
            fontFamily: Alloy.CFG.font.ostrichBlack
        },
        width: Ti.UI.SIZE,
        color: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            x: 2,
            y: 1
        },
        left: 10,
        text: "Reminder Settings",
        id: "reminderSettingsLabel"
    });
    $.__views.reminderSettingsView.add($.__views.reminderSettingsLabel);
    $.__views.reminderSettingsIcon = Ti.UI.createImageView({
        right: 36,
        width: 30,
        height: 30,
        image: "/images/19-gear.png",
        id: "reminderSettingsIcon"
    });
    $.__views.reminderSettingsView.add($.__views.reminderSettingsIcon);
    openReminderSettings ? $.__views.reminderSettingsIcon.addEventListener("click", openReminderSettings) : __defers["$.__views.reminderSettingsIcon!click!openReminderSettings"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.reminderSettingsIcon!click!openReminderSettings"] && $.__views.reminderSettingsIcon.addEventListener("click", openReminderSettings);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;