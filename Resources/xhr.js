Ti.taffy = require("ti.taffydb").taffyDb;

var cacheManager = Ti.taffy();

XHR = function() {
    cacheManager.exists("cache") && cacheManager.open("cache");
};

XHR.prototype.get = function(url, onSuccess, onError, extraParams) {
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};
    var extraParams = extraParams || {};
    extraParams.async = extraParams.async || true;
    extraParams.ttl = extraParams.ttl || false;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
    extraParams.contentType = extraParams.contentType || "application/json";
    var cache = readCache(url);
    if (extraParams.ttl && 0 != cache) {
        var result = {};
        result.status = "cache";
        result.data = cache;
        onSuccess(result);
    } else {
        var xhr = Titanium.Network.createHTTPClient({
            enableKeepAlive: false
        });
        var result = {};
        xhr.open("GET", url, extraParams.async);
        xhr.setRequestHeader("Content-Type", extraParams.contentType);
        if (extraParams.shouldAuthenticate) {
            var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
            xhr.setRequestHeader("Authorization", authstr);
        }
        xhr.onload = function() {
            result.status = 200 == xhr.status ? "ok" : xhr.status;
            result.data = xhr.responseText;
            onSuccess(result);
            writeCache(result.data, url, extraParams.ttl);
        };
        xhr.onerror = function(e) {
            result.status = "error";
            result.data = e;
            result.code = xhr.status;
            onError(result);
        };
        xhr.send();
    }
};

XHR.prototype.post = function(url, data, onSuccess, onError, extraParams) {
    Titanium.API.info(url + " " + JSON.stringify(data));
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};
    var extraParams = extraParams || {};
    extraParams.async = extraParams.async || true;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
    extraParams.contentType = extraParams.contentType || "application/json";
    var xhr = Titanium.Network.createHTTPClient({
        enableKeepAlive: false
    });
    var result = {};
    xhr.open("POST", url, extraParams.async);
    xhr.setRequestHeader("Content-Type", extraParams.contentType);
    if (extraParams.shouldAuthenticate) {
        var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
        xhr.setRequestHeader("Authorization", authstr);
    }
    xhr.onload = function() {
        result.status = 200 == xhr.status ? "ok" : xhr.status;
        result.data = xhr.responseText;
        onSuccess(result);
    };
    xhr.onerror = function(e) {
        result.status = "error";
        result.data = e.error;
        result.code = xhr.status;
        onError(result);
    };
    xhr.send(data);
};

XHR.prototype.put = function(url, data, onSuccess, onError, extraParams) {
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};
    var extraParams = extraParams || {};
    extraParams.async = extraParams.async || true;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
    extraParams.contentType = extraParams.contentType || "application/json";
    var xhr = Titanium.Network.createHTTPClient({
        enableKeepAlive: false
    });
    var result = {};
    xhr.open("PUT", url, extraParams.async);
    xhr.setRequestHeader("Content-Type", extraParams.contentType);
    if (extraParams.shouldAuthenticate) {
        var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
        xhr.setRequestHeader("Authorization", authstr);
    }
    xhr.onload = function() {
        result.status = 200 == xhr.status ? "ok" : xhr.status;
        result.data = xhr.responseText;
        onSuccess(result);
    };
    xhr.onerror = function(e) {
        result.status = "error";
        result.data = e.error;
        result.code = xhr.status;
        onError(result);
    };
    xhr.send(data);
};

XHR.prototype.destroy = function(url, onSuccess, onError, extraParams) {
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};
    var extraParams = extraParams || {};
    extraParams.async = extraParams.async || true;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
    extraParams.contentType = extraParams.contentType || "application/json";
    var xhr = Titanium.Network.createHTTPClient({
        enableKeepAlive: false
    });
    var result = {};
    xhr.open("DELETE", url, extraParams.async);
    xhr.setRequestHeader("Content-Type", extraParams.contentType);
    if (extraParams.shouldAuthenticate) {
        var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
        xhr.setRequestHeader("Authorization", authstr);
    }
    xhr.onload = function() {
        result.status = 200 == xhr.status ? "ok" : xhr.status;
        result.data = xhr.responseText;
        onSuccess(result);
    };
    xhr.onerror = function(e) {
        result.status = "error";
        result.data = e.error;
        result.code = xhr.status;
        onError(result);
    };
    xhr.send();
};

readCache = function(url) {
    var hashedURL = Titanium.Utils.md5HexDigest(url);
    var cache = cacheManager({
        file: hashedURL
    }).first();
    var result = false;
    if (0 != cache) {
        var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, cache.file);
        if (cache.timestamp >= new Date().getTime()) result = file.read(); else {
            cacheManager(cache).remove();
            file.deleteFile();
            cacheManager.save();
        }
    }
    return result;
};

writeCache = function(data, url, ttl) {
    var hashedURL = Titanium.Utils.md5HexDigest(url);
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, hashedURL);
    if (file.write(data)) {
        cacheManager.insert({
            file: hashedURL,
            timestamp: new Date().getTime() + 1e3 * 60 * ttl
        });
        cacheManager.save("cache");
    }
};

XHR.prototype.clearCache = function() {
    var cachedDocuments = cacheManager({
        timestamp: {
            lte: new Date().getTime()
        }
    }).get();
    var cachedDocumentsCount = cachedDocuments.length;
    if (cachedDocumentsCount > 0) {
        for (var i = 0; cachedDocumentsCount - 1 >= i; i++) {
            var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, cachedDocuments[i].file);
            cacheManager(cachedDocuments[i].file).remove();
            file.deleteFile();
        }
        cacheManager.save();
    }
    return cachedDocumentsCount;
};

XHR.prototype.paramsToQueryString = function(formdata, numeric_prefix, arg_separator) {
    var value, key, tmp = [];
    var _http_build_query_helper = function(key, val, arg_separator) {
        var k, tmp = [];
        true === val ? val = "1" : false === val && (val = "0");
        if (null != val) {
            if ("object" == typeof val) {
                for (k in val) null != val[k] && tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                return tmp.join(arg_separator);
            }
            if ("function" != typeof val) return Ti.Network.encodeURIComponent(key) + "=" + Ti.Network.encodeURIComponent(val);
            throw new Error("There was an error processing for http_build_query().");
        }
        return "";
    };
    arg_separator || (arg_separator = "&");
    for (key in formdata) {
        value = formdata[key];
        numeric_prefix && !isNaN(key) && (key = String(numeric_prefix) + key);
        var query = _http_build_query_helper(key, value, arg_separator);
        "" != query && tmp.push(query);
    }
    return tmp.join(arg_separator);
};

module.exports = XHR;