function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "to.t10.issList/" + s : s.substring(0, index) + "/to.t10.issList/" + s.substring(index + 1);
    return path;
}

function Controller() {
    new (require("alloy/widget"))("to.t10.issList");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.issListItem = Ti.UI.createView({
        left: 5,
        right: 5,
        height: 84,
        backgroundColor: "#fff",
        id: "issListItem"
    });
    $.__views.issListItem && $.addTopLevelView($.__views.issListItem);
    $.__views.day = Ti.UI.createLabel({
        top: 4,
        left: 10,
        text: "Thursday",
        id: "day"
    });
    $.__views.issListItem.add($.__views.day);
    $.__views.time = Ti.UI.createLabel({
        top: 4,
        right: 10,
        text: "Time",
        id: "time"
    });
    $.__views.issListItem.add($.__views.time);
    $.__views.icon = Ti.UI.createImageView({
        id: "icon"
    });
    $.__views.issListItem.add($.__views.icon);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;