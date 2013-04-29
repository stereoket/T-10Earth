function xPad(x, pad, r) {
    "undefined" == typeof r && (r = 10);
    for (;r > parseInt(x, 10) && r > 1; r /= 10) x = pad.toString() + x;
    return x.toString();
}

var locales = {};

locales.en = {
    a: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    A: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    b: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    B: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    c: "%a %d %b %Y %T %Z",
    p: [ "AM", "PM" ],
    P: [ "am", "pm" ],
    x: "%d/%m/%y",
    X: "%T"
};

locales["en-US"] = locales.en;

locales["en-US"].c = "%a %d %b %Y %r %Z";

locales["en-US"].x = "%D";

locales["en-US"].X = "%r";

locales["en-GB"] = locales.en;

locales["en-AU"] = locales["en-GB"];

var formats = {
    a: function(d) {
        return locales[d.locale].a[d.getDay()];
    },
    A: function(d) {
        return locales[d.locale].A[d.getDay()];
    },
    b: function(d) {
        return locales[d.locale].b[d.getMonth()];
    },
    B: function(d) {
        return locales[d.locale].B[d.getMonth()];
    },
    c: "toLocaleString",
    C: function(d) {
        return xPad(parseInt(d.getFullYear() / 100, 10), 0);
    },
    d: [ "getDate", "0" ],
    e: [ "getDate", " " ],
    g: function(d) {
        return xPad(parseInt(formats.G(d) / 100, 10), 0);
    },
    G: function(d) {
        var y = d.getFullYear();
        var V = parseInt(formats.V(d), 10);
        var W = parseInt(formats.W(d), 10);
        W > V ? y++ : 0 === W && V >= 52 && y--;
        return y;
    },
    H: [ "getHours", "0" ],
    I: function(d) {
        var I = d.getHours() % 12;
        return xPad(0 === I ? 12 : I, 0);
    },
    j: function(d) {
        var ms = d - new Date("" + d.getFullYear() + "/1/1 GMT");
        ms += 6e4 * d.getTimezoneOffset();
        var doy = parseInt(ms / 6e4 / 60 / 24, 10) + 1;
        return xPad(doy, 0, 100);
    },
    l: function(d) {
        var l = d.getHours() % 12;
        return xPad(0 == l ? 12 : l, " ");
    },
    m: function(d) {
        return xPad(d.getMonth() + 1, 0);
    },
    M: [ "getMinutes", "0" ],
    p: function(d) {
        return locales[d.locale].p[d.getHours() >= 12 ? 1 : 0];
    },
    P: function(d) {
        return locales[d.locale].P[d.getHours() >= 12 ? 1 : 0];
    },
    S: [ "getSeconds", "0" ],
    u: function(d) {
        var dow = d.getDay();
        return 0 === dow ? 7 : dow;
    },
    U: function(d) {
        var doy = parseInt(formats.j(d), 10);
        var rdow = 6 - d.getDay();
        var woy = parseInt((doy + rdow) / 7, 10);
        return xPad(woy, 0);
    },
    V: function(d) {
        var woy = parseInt(formats.W(d), 10);
        var dow1_1 = new Date("" + d.getFullYear() + "/1/1").getDay();
        var idow = woy + (dow1_1 > 4 || 1 >= dow1_1 ? 0 : 1);
        53 == idow && 4 > new Date("" + d.getFullYear() + "/12/31").getDay() ? idow = 1 : 0 === idow && (idow = formats.V(new Date("" + (d.getFullYear() - 1) + "/12/31")));
        return xPad(idow, 0);
    },
    w: "getDay",
    W: function(d) {
        var doy = parseInt(formats.j(d), 10);
        var rdow = 7 - formats.u(d);
        var woy = parseInt((doy + rdow) / 7, 10);
        return xPad(woy, 0, 10);
    },
    y: function(d) {
        return xPad(d.getFullYear() % 100, 0);
    },
    Y: "getFullYear",
    z: function(d) {
        var o = d.getTimezoneOffset();
        var H = xPad(parseInt(Math.abs(o / 60), 10), 0);
        var M = xPad(o % 60, 0);
        return (o > 0 ? "-" : "+") + H + M;
    },
    Z: function(d) {
        return d.toString().replace(/^.*\(([^)]+)\)$/, "$1");
    },
    "%": function() {
        return "%";
    }
};

var aggregates = {
    c: "locale",
    D: "%m/%d/%y",
    h: "%b",
    n: "\n",
    r: "%I:%M:%S %p",
    R: "%H:%M",
    t: "	",
    T: "%H:%M:%S",
    x: "locale",
    X: "locale"
};

exports.strftime = function(d, fmt, locale) {
    d.locale = locale = locales[locale] ? locale : "en-GB";
    while (fmt.match(/%[cDhnrRtTxXzZ]/)) fmt = fmt.replace(/%([cDhnrRtTxXzZ])/g, function(m0, m1) {
        var f = aggregates[m1];
        return "locale" == f ? locales[locale][m1] : f;
    });
    var str = fmt.replace(/%([aAbBCdegGHIjlmMpPSuUVwWyY%])/g, function(m0, m1) {
        var f = formats[m1];
        return "string" == typeof f ? d[f]() : "function" == typeof f ? f.call(d, d) : "object" == typeof f && "string" == typeof f[0] ? xPad(d[f[0]](), f[1]) : m1;
    });
    return str;
};