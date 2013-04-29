function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.timeContainer = Ti.UI.createView({
        backgroundImage: "/images/issListPassView_bg.png",
        left: 10,
        right: 10,
        height: 60,
        color: "#fff",
        id: "timeContainer"
    });
    $.__views.timeContainer && $.addTopLevelView($.__views.timeContainer);
    $.__views.day = Ti.UI.createLabel({
        top: 5,
        left: 10,
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichMedium,
            fontSize: 20
        },
        text: "Thursday",
        id: "day"
    });
    $.__views.timeContainer.add($.__views.day);
    $.__views.time = Ti.UI.createLabel({
        right: 10,
        left: 10,
        top: 0,
        height: Ti.UI.FILL,
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.font.ostrichBlack,
            fontSize: 48
        },
        textAlign: "center",
        text: "Time",
        id: "time"
    });
    $.__views.timeContainer.add($.__views.time);
    $.__views.icon = Ti.UI.createImageView({
        bottom: 5,
        id: "icon"
    });
    $.__views.timeContainer.add($.__views.icon);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;