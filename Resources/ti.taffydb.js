var TiHelpers = {};

(function() {
    function findPersistMode(settings) {
        var results = "file";
        settings.hasOwnProperty("persistMode") && void 0 !== settings.persistMode && null !== settings.persistMode && (results = settings.persistMode);
        return results;
    }
    function createTaffyFolder() {
        var parent = Ti.Filesystem.applicationDataDirectory;
        var taffFolder = Ti.Filesystem.getFile(parent, "titaffydb");
        taffFolder.exists() || taffFolder.createDirectory();
    }
    function fetchTaffyFile(dbName) {
        createTaffyFolder();
        var parent = Ti.Filesystem.applicationDataDirectory;
        var taffFolder = parent + "titaffydb";
        var taffyFile = Ti.Filesystem.getFile(taffFolder, dbName.toUpperCase());
        return taffyFile;
    }
    function deleteTaffyDbFile(dbName) {
        var taffyFile = fetchTaffyFile(dbName);
        taffyFile.exists() && taffyFile.deleteFile();
        taffyFile = null;
    }
    function taffyDbFileExists(dbName) {
        var taffyFile = fetchTaffyFile(dbName);
        var results = taffyFile.exists();
        taffyFile = null;
        return results;
    }
    function taffyDbPropExists(dbName) {
        var fetchTest = Ti.App.Properties.getString("ti_taffydb_" + dbName.toUpperCase(), "");
        return 0 === TiHelpers.safeString(fetchTest).length;
    }
    function readFromFile(dbName) {
        var taffyFile = fetchTaffyFile(dbName);
        if (!taffyFile.exists()) {
            taffyFile = null;
            return null;
        }
        try {
            var contents = taffyFile.read();
            taffyFile = null;
            return null == contents || null == contents ? null : JSON.parse(contents);
        } catch (err) {
            Ti.API.info("TaffyDb Load Error: " + err);
            throw "Invalid TaffyDb file";
        }
    }
    function readFromProp(dbName) {
        try {
            var fetchTest = Ti.App.Properties.getString("ti_taffydb_" + dbName.toUpperCase(), "");
            return 0 === TiHelpers.safeString(fetchTest).length ? null : JSON.parse(fetchTest);
        } catch (err) {
            Ti.API.info("TaffyDb Load Error: " + err);
            throw "Invalid TaffyDb file";
        }
    }
    function saveTaffyDbFile(dbName, dbObject) {
        var taffyFile = fetchTaffyFile(dbName);
        taffyFile.write(JSON.stringify(dbObject));
        taffyFile = null;
    }
    TiHelpers.safeString = function(value) {
        if (void 0 == value) return "";
        if (null == value) return "";
        return value;
    };
    TiHelpers.readTaffyDb = function(dbName, settings) {
        var persistMode = findPersistMode(settings);
        if ("property" !== persistMode.toLowerCase().trim()) return readFromFile(dbName);
        readFromProp(dbName);
    };
    TiHelpers.saveTaffyDb = function(dbName, dbObject, settings) {
        var persistMode = findPersistMode(settings);
        if ("property" !== persistMode.toLowerCase().trim()) return saveTaffyDbFile(dbName, dbObject);
        Ti.App.Properties.setString("ti_taffydb_" + dbName.toUpperCase(), JSON.stringify(dbObject));
    };
    TiHelpers.taffyDbExists = function(dbName, settings) {
        var persistMode = findPersistMode(settings);
        return "property" === persistMode.toLowerCase().trim() ? taffyDbPropExists(dbName) : taffyDbFileExists(dbName);
    };
    TiHelpers.deleteTaffyDb = function(dbName, settings) {
        var persistMode = findPersistMode(settings);
        if ("property" !== persistMode.toLowerCase().trim()) return deleteTaffyDbFile(dbName);
        Ti.App.Properties.removeProperty("ti_taffydb_" + dbName.toUpperCase());
    };
})();

var TAFFY;

(function() {
    var TC = 1, idpad = "000000", cmax = 1e3, API = {};
    var JSONProtect = function(t) {
        return TAFFY.isArray(t) || TAFFY.isObject(t) ? t : JSON.parse(t);
    };
    var each = function(a, fun, u) {
        if (a && (T.isArray(a) && 1 == a.length || !T.isArray(a))) fun(T.isArray(a) ? a[0] : a, 0); else for (var r, i, x = 0, a = T.isArray(a) ? a : [ a ], y = a.length; y > x; x++) {
            var i = a[x];
            if (!T.isUndefined(i) || u || false) {
                r = fun(i, x);
                if (r === T.EXIT) break;
            }
        }
    };
    var eachin = function(o, fun) {
        var r, x = 0;
        for (var i in o) {
            o.hasOwnProperty(i) && (r = fun(o[i], i, x++));
            if (r === T.EXIT) break;
        }
    };
    API["extend"] = function(m, f) {
        API[m] = function() {
            return f.apply(this, arguments);
        };
    };
    var isIndexable = function(f) {
        if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) return true;
        if (T.isObject(f) && f["___id"] && f["___s"]) return true;
        if (T.isArray(f)) {
            var i = true;
            each(f, function(r) {
                if (!isIndexable(r)) {
                    i = false;
                    return TAFFY.EXIT;
                }
            });
            return i;
        }
        return false;
    };
    var returnFilter = function(f) {
        var nf = [];
        T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && (f = {
            ___id: f
        });
        if (T.isArray(f)) {
            each(f, function(r) {
                nf.push(returnFilter(r));
            });
            var f = function() {
                var that = this;
                var match = false;
                each(nf, function(f) {
                    runFilters(that, f) && (match = true);
                });
                return match;
            };
            return f;
        }
        if (T.isObject(f)) {
            T.isObject(f) && f["___id"] && f["___s"] && (f = {
                ___id: f["___id"]
            });
            eachin(f, function(v, i) {
                T.isObject(v) || (v = {
                    is: v
                });
                eachin(v, function(mtest, s) {
                    var c = [];
                    var looper = "hasAll" === s ? function(mtest, func) {
                        func(mtest);
                    } : each;
                    looper(mtest, function(mtest) {
                        var su = true, f = false;
                        var matchFunc = function() {
                            var mvalue = this[i];
                            if (0 === s.indexOf("!")) {
                                su = false;
                                s = s.substring(1, s.length);
                            }
                            var r = "regex" === s ? mtest.test(mvalue) : "lt" === s ? mtest > mvalue : "gt" === s ? mvalue > mtest : "lte" === s ? mtest >= mvalue : "gte" === s ? mvalue >= mtest : "left" === s ? 0 === mvalue.indexOf(mtest) : "leftnocase" === s ? 0 === mvalue.toLowerCase().indexOf(mtest.toLowerCase()) : "right" === s ? mvalue.substring(mvalue.length - mtest.length) === mtest : "rightnocase" === s ? mvalue.toLowerCase().substring(mvalue.length - mtest.length) === mtest.toLowerCase() : "like" === s ? mvalue.indexOf(mtest) >= 0 : "likenocase" === s ? mvalue.toLowerCase().indexOf(mtest.toLowerCase()) >= 0 : "is" === s ? mvalue === mtest : "isnocase" === s ? mvalue.toLowerCase() === mtest.toLowerCase() : "has" === s ? T.has(mvalue, mtest) : "hasall" === s ? T.hasAll(mvalue, mtest) : -1 !== s.indexOf("is") || TAFFY.isNull(mvalue) || TAFFY.isUndefined(mvalue) || TAFFY.isObject(mtest) || TAFFY.isArray(mtest) ? T[s] && T.isFunction(T[s]) && 0 === s.indexOf("is") ? T[s](mvalue) === mtest : T[s] && T.isFunction(T[s]) ? T[s](mvalue, mtest) : su === f : mtest === mvalue[s];
                            r = r && !su ? false : r || su ? r : true;
                            return r;
                        };
                        c.push(matchFunc);
                    });
                    1 === c.length ? nf.push(c[0]) : nf.push(function() {
                        var that = this;
                        var match = false;
                        each(c, function(f) {
                            f.apply(that) && (match = true);
                        });
                        return match;
                    });
                });
            });
            var f = function() {
                var that = this;
                var match = true;
                match = 1 != nf.length || nf[0].apply(that) ? 2 != nf.length || nf[0].apply(that) && nf[1].apply(that) ? 3 != nf.length || nf[0].apply(that) && nf[1].apply(that) && nf[2].apply(that) ? 4 != nf.length || nf[0].apply(that) && nf[1].apply(that) && nf[2].apply(that) && nf[3].apply(that) ? true : false : false : false : false;
                nf.length > 4 && each(nf, function(f) {
                    runFilters(that, f) || (match = false);
                });
                return match;
            };
            return f;
        }
        if (T.isFunction(f)) return f;
    };
    var orderByCol = function(ar, o) {
        var sortFunc = function(a, b) {
            var r = 0;
            T.each(o, function(sd) {
                var o = sd.split(" ");
                var col = o[0];
                var dir = 1 === o.length ? "logical" : o[1];
                if ("logical" === dir) {
                    var c = numcharsplit(a[col]), d = numcharsplit(b[col]);
                    T.each(c.length <= d.length ? c : d, function(x, i) {
                        if (c[i] < d[i]) {
                            r = -1;
                            return TAFFY.EXIT;
                        }
                        if (c[i] > d[i]) {
                            r = 1;
                            return TAFFY.EXIT;
                        }
                    });
                } else if ("logicaldesc" === dir) {
                    var c = numcharsplit(a[col]), d = numcharsplit(b[col]);
                    T.each(c.length <= d.length ? c : d, function(x, i) {
                        if (c[i] > d[i]) {
                            r = -1;
                            return TAFFY.EXIT;
                        }
                        if (c[i] < d[i]) {
                            r = 1;
                            return TAFFY.EXIT;
                        }
                    });
                } else {
                    if ("asec" === dir && a[col] < b[col]) {
                        r = -1;
                        return T.EXIT;
                    }
                    if ("asec" === dir && a[col] > b[col]) {
                        r = 1;
                        return T.EXIT;
                    }
                    if ("desc" === dir && a[col] > b[col]) {
                        r = -1;
                        return T.EXIT;
                    }
                    if ("desc" === dir && a[col] < b[col]) {
                        r = 1;
                        return T.EXIT;
                    }
                }
                0 === r && "logical" === dir && c.length < d.length ? r = -1 : 0 === r && "logical" === dir && c.length > d.length ? r = 1 : 0 === r && "logicaldesc" === dir && c.length > d.length ? r = -1 : 0 === r && "logicaldesc" === dir && c.length < d.length && (r = 1);
                if (0 != r) return T.EXIT;
            });
            return r;
        };
        return ar.sort(sortFunc);
    };
    var numcharsplit = null;
    (function() {
        var cache = {};
        var cachcounter = 0;
        numcharsplit = function(thing) {
            if (cachcounter > cmax) {
                cache = {};
                cachcounter = 0;
            }
            return cache["_" + thing] || function() {
                var nthing = String(thing), na = [], rv = "_", rt = "";
                for (var x = 0, xx = nthing.length; xx > x; x++) {
                    var c = nthing.charCodeAt(x);
                    if (c >= 48 && 57 >= c || 46 === c) {
                        if ("n" != rt) {
                            rt = "n";
                            na.push(rv.toLowerCase());
                            rv = "";
                        }
                        rv += nthing.charAt(x);
                    } else {
                        if ("s" != rt) {
                            rt = "s";
                            na.push(parseFloat(rv));
                            rv = "";
                        }
                        rv += nthing.charAt(x);
                    }
                }
                na.push("n" === rt ? parseFloat(rv) : rv.toLowerCase());
                na.shift();
                cache["_" + thing] = na;
                cachcounter++;
                return na;
            }();
        };
    })();
    var run = function() {
        this.context({
            results: this.getDBI().query(this.context())
        });
    };
    API.extend("filter", function() {
        var nc = TAFFY.mergeObj(this.context(), {
            run: null
        });
        var nq = [];
        each(nc.q, function(v) {
            nq.push(v);
        });
        nc.q = nq;
        each(arguments, function(f) {
            nc.q.push(returnFilter(f));
            nc.filterRaw.push(f);
        });
        return this.getroot(nc);
    });
    API.extend("order", function(o) {
        var o = o.split(",");
        var x = [];
        each(o, function(r) {
            x.push(r.replace(/^\s*/, "").replace(/\s*$/, ""));
        });
        var nc = TAFFY.mergeObj(this.context(), {
            sort: null
        });
        nc.order = x;
        return this.getroot(nc);
    });
    API.extend("limit", function(n) {
        var nc = TAFFY.mergeObj(this.context(), {});
        nc.limit = n;
        if (nc.run && nc.sort) {
            var limitedresults = [];
            each(nc.results, function(i, x) {
                if (x + 1 > n) return TAFFY.EXIT;
                limitedresults.push(i);
            });
            nc.results = limitedresults;
        }
        return this.getroot(nc);
    });
    API.extend("start", function(n) {
        var nc = TAFFY.mergeObj(this.context(), {});
        nc.start = n;
        if (nc.run && nc.sort && !nc.limit) {
            var limitedresults = [];
            each(nc.results, function(i, x) {
                x + 1 > n && limitedresults.push(i);
            });
            nc.results = limitedresults;
        } else nc = TAFFY.mergeObj(this.context(), {
            run: null,
            start: n
        });
        return this.getroot(nc);
    });
    API.extend("update", function() {
        var runEvent = true, o = {}, args = arguments;
        if (!TAFFY.isString(arguments[0]) || 2 != arguments.length && 3 != arguments.length) {
            o = args[0];
            2 == args.length && (runEvent = args[0]);
        } else {
            o[arguments[0]] = arguments[1];
            3 == arguments.length && (runEvent = arguments[2]);
        }
        var that = this;
        run.call(this);
        each(this.context().results, function(r) {
            var c = o;
            TAFFY.isFunction(c) ? c = c.apply(TAFFY.mergeObj(r, {})) : T.isFunction(c) && (c = c(TAFFY.mergeObj(r, {})));
            TAFFY.isObject(c) && that.getDBI().update(r.___id, c, runEvent);
        });
        this.context().results.length && this.context({
            run: null
        });
        return this;
    });
    API.extend("remove", function(runEvent) {
        var that = this;
        var c = 0;
        run.call(this);
        each(this.context().results, function(r) {
            that.getDBI().remove(r.___id);
            c++;
        });
        if (this.context().results.length) {
            this.context({
                run: null
            });
            that.getDBI().removeCommit(runEvent);
        }
        return c;
    });
    API.extend("count", function() {
        run.call(this);
        return this.context().results.length;
    });
    API.extend("callback", function(f, delay) {
        if (f) {
            var that = this;
            setTimeout(function() {
                run.call(that);
                f.call(that.getroot(that.context()));
            }, delay ? delay : 0);
        }
        return null;
    });
    API.extend("get", function() {
        run.call(this);
        return this.context().results;
    });
    API.extend("stringify", function() {
        return JSON.stringify(this.get());
    });
    API.extend("first", function() {
        run.call(this);
        return this.context().results[0] || false;
    });
    API.extend("last", function() {
        run.call(this);
        return this.context().results[this.context().results.length - 1] || false;
    });
    API.extend("sum", function() {
        var total = 0;
        run.call(this);
        var that = this;
        each(arguments, function(c) {
            each(that.context().results, function(r) {
                total += r[c];
            });
        });
        return total;
    });
    API.extend("min", function(c) {
        var lowest = null;
        run.call(this);
        each(this.context().results, function(r) {
            (null === lowest || lowest > r[c]) && (lowest = r[c]);
        });
        return lowest;
    });
    API.extend("max", function(c) {
        var highest = null;
        run.call(this);
        each(this.context().results, function(r) {
            (null === highest || r[c] > highest) && (highest = r[c]);
        });
        return highest;
    });
    API.extend("select", function() {
        var ra = [];
        var args = arguments;
        run.call(this);
        1 === arguments.length ? each(this.context().results, function(r) {
            ra.push(r[args[0]]);
        }) : each(this.context().results, function(r) {
            var row = [];
            each(args, function(c) {
                row.push(r[c]);
            });
            ra.push(row);
        });
        return ra;
    });
    API.extend("distinct", function() {
        var ra = [];
        var args = arguments;
        run.call(this);
        1 === arguments.length ? each(this.context().results, function(r) {
            var v = r[args[0]];
            var dup = false;
            each(ra, function(d) {
                if (v === d) {
                    dup = true;
                    return TAFFY.EXIT;
                }
            });
            dup || ra.push(v);
        }) : each(this.context().results, function(r) {
            var row = [];
            each(args, function(c) {
                row.push(r[c]);
            });
            var dup = false;
            each(ra, function(d) {
                var ldup = true;
                each(args, function(c, i) {
                    if (row[i] != d[i]) {
                        ldup = false;
                        return TAFFY.EXIT;
                    }
                });
                if (ldup) {
                    dup = true;
                    return TAFFY.EXIT;
                }
            });
            dup || ra.push(row);
        });
        return ra;
    });
    API.extend("supplant", function(template, returnarray) {
        var ra = [];
        run.call(this);
        each(this.context().results, function(r) {
            ra.push(template.replace(/{([^{}]*)}/g, function(a, b) {
                var v = r[b];
                return "string" == typeof v || "number" == typeof v ? v : a;
            }));
        });
        return returnarray ? ra : ra.join("");
    });
    API.extend("each", function(m) {
        run.call(this);
        each(this.context().results, m);
        return this;
    });
    API.extend("map", function(m) {
        var ra = [];
        run.call(this);
        each(this.context().results, function(r) {
            ra.push(m(r));
        });
        return ra;
    });
    var runFilters = function(r, filter) {
        var match = true;
        each(filter, function(mf) {
            switch (T.typeOf(mf)) {
              case "function":
                if (!mf.apply(r)) {
                    match = false;
                    return TAFFY.EXIT;
                }
                break;

              case "array":
                match = 1 == mf.length ? runFilters(r, mf[0]) : 2 == mf.length ? runFilters(r, mf[0]) || runFilters(r, mf[1]) : 3 == mf.length ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) : 4 == mf.length ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) || runFilters(r, mf[3]) : false;
                mf.length > 4 && each(mf, function(f) {
                    runFilters(r, f) && (match = true);
                });
            }
        });
        return match;
    };
    var T = function(d) {
        var TOb = [], ID = {}, RC = 1, settings = {
            template: false,
            onInsert: false,
            onUpdate: false,
            onRemove: false,
            onDBChange: false,
            storageName: false,
            forcePropertyCase: null,
            cacheSize: 100,
            persistMode: "file",
            autoCommit: false
        }, dm = new Date(), CacheCount = 0, CacheClear = 0, dirtyTransCount = 0;
        Cache = {};
        var runIndexes = function(indexes) {
            if (0 == indexes.length) return TOb;
            var records = [];
            var UniqueEnforce = false;
            each(indexes, function(f) {
                if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && TOb[ID[f]]) {
                    records.push(TOb[ID[f]]);
                    UniqueEnforce = true;
                }
                if (T.isObject(f) && f["___id"] && f["___s"] && TOb[ID[f["___id"]]]) {
                    records.push(TOb[ID[f["___id"]]]);
                    UniqueEnforce = true;
                }
                T.isArray(f) && each(f, function(r) {
                    each(runIndexes(r), function(rr) {
                        records.push(rr);
                    });
                });
            });
            UniqueEnforce && records.length > 1 && (records = []);
            return records;
        };
        var DBI = {
            dm: function(nd) {
                dirtyTransCount++;
                if (nd) {
                    dm = nd;
                    Cache = {};
                    CacheCount = 0;
                    CacheClear = 0;
                }
                settings.onDBChange && setTimeout(function() {
                    settings.onDBChange.call(TOb);
                }, 0);
                settings.autoCommit && TiHelpers.safeString(settings.storageName).trim().length > 0 && setTimeout(function() {
                    root.saveDb(settings.storageName);
                });
                return dm;
            },
            insert: function(i, runEvent) {
                var columns = [], records = [], input = JSONProtect(i);
                each(input, function(v, i) {
                    if (T.isArray(v) && 0 === i) {
                        each(v, function(av) {
                            columns.push("lower" === settings.forcePropertyCase ? av.toLowerCase() : "upper" === settings.forcePropertyCase ? av.toUpperCase() : av);
                        });
                        return true;
                    }
                    if (T.isArray(v)) {
                        var nv = {};
                        each(v, function(av, ai) {
                            nv[columns[ai]] = av;
                        });
                        v = nv;
                    } else if (T.isObject(v) && settings.forcePropertyCase) {
                        var o = {};
                        eachin(v, function(av, ai) {
                            o["lower" === settings.forcePropertyCase ? ai.toLowerCase() : "upper" === settings.forcePropertyCase ? ai.toUpperCase() : ai] = v[ai];
                        });
                        v = o;
                    }
                    RC++;
                    v["___id"] = "T" + String(idpad + TC).slice(-6) + "R" + String(idpad + RC).slice(-6);
                    v["___s"] = true;
                    records.push(v["___id"]);
                    settings.template && (v = T.mergeObj(settings.template, v));
                    TOb.push(v);
                    ID[v["___id"]] = TOb.length - 1;
                    settings.onInsert && (runEvent || TAFFY.isUndefined(runEvent)) && settings.onInsert.call(v);
                    DBI.dm(new Date());
                });
                return root(records);
            },
            sort: function(o) {
                TOb = orderByCol(TOb, o.split(","));
                ID = {};
                each(TOb, function(r, i) {
                    ID[r["___id"]] = i;
                });
                DBI.dm(new Date());
                return true;
            },
            update: function(id, changes, runEvent) {
                var nc = {};
                if (settings.forcePropertyCase) {
                    eachin(changes, function(v, p) {
                        nc["lower" === settings.forcePropertyCase ? p.toLowerCase() : "upper" === settings.forcePropertyCase ? p.toUpperCase() : p] = v;
                    });
                    changes = nc;
                }
                var or = TOb[ID[id]];
                var nr = T.mergeObj(or, changes);
                var tc = {};
                var hasChange = false;
                eachin(nr, function(v, i) {
                    if (TAFFY.isUndefined(or[i]) || or[i] != v) {
                        tc[i] = v;
                        hasChange = true;
                    }
                });
                if (hasChange) {
                    settings.onUpdate && (runEvent || TAFFY.isUndefined(runEvent)) && settings.onUpdate.call(nr, TOb[ID[id]], tc);
                    TOb[ID[id]] = nr;
                    DBI.dm(new Date());
                }
            },
            remove: function(id) {
                TOb[ID[id]].___s = false;
                dirtyTransCount++;
            },
            resetDb: function() {
                TOb = [];
                ID = {};
                RC = 1;
                CacheCount = 0;
                CacheClear = 0;
                Cache = {};
                dm = new Date();
                dirtyTransCount = 0;
            },
            removeCommit: function(runEvent) {
                for (var x = TOb.length - 1; x > -1; x--) if (!TOb[x].___s) {
                    settings.onRemove && (runEvent || TAFFY.isUndefined(runEvent)) && settings.onRemove.call(TOb[x]);
                    ID[TOb[x].___id] = void 0;
                    TOb.splice(x, 1);
                }
                ID = {};
                each(TOb, function(r, i) {
                    ID[r["___id"]] = i;
                });
                DBI.dm(new Date());
            },
            query: function(context) {
                var returnq;
                if (settings.cacheSize) {
                    var cid = "";
                    each(context.filterRaw, function(r) {
                        if (T.isFunction(r)) {
                            cid = "nocache";
                            return TAFFY.EXIT;
                        }
                    });
                    "" == cid && (cid = JSON.stringify(T.mergeObj(context, {
                        q: false,
                        run: false,
                        sort: false
                    })));
                }
                if (!context.results || !context.run || context.run && DBI.dm() > context.run) {
                    var results = [];
                    if (settings.cacheSize && Cache[cid]) {
                        Cache[cid].i = CacheCount++;
                        return Cache[cid].results;
                    }
                    if (0 == context.q.length && 0 == context.index.length) {
                        each(TOb, function(r) {
                            results.push(r);
                        });
                        returnq = results;
                    } else {
                        var indexed = runIndexes(context.index);
                        each(indexed, function(r) {
                            (0 == context.q.length || runFilters(r, context.q)) && results.push(r);
                        });
                        returnq = results;
                    }
                } else returnq = context.results;
                !(context.order.length > 0) || context.run && context.sort || (returnq = orderByCol(returnq, context.order));
                if (returnq.length && (context.limit && context.limit < returnq.length || context.start)) {
                    var limitq = [];
                    each(returnq, function(r, i) {
                        if (!context.start || context.start && i + 1 >= context.start) if (context.limit) {
                            var ni = context.start ? i + 1 - context.start : i;
                            if (context.limit > ni) limitq.push(r); else if (ni > context.limit) return TAFFY.EXIT;
                        } else limitq.push(r);
                    });
                    returnq = limitq;
                }
                if (settings.cacheSize && "nocache" != cid) {
                    CacheClear++;
                    setTimeout(function() {
                        if (CacheClear >= 2 * settings.cacheSize) {
                            CacheClear = 0;
                            var bCounter = CacheCount - settings.cacheSize;
                            var nc = {};
                            eachin(function(r, k) {
                                r.i >= bCounter && (nc[k] = r);
                            });
                            Cache = nc;
                        }
                    }, 0);
                    Cache[cid] = {
                        i: CacheCount++,
                        results: returnq
                    };
                }
                return returnq;
            }
        };
        var helpers = {
            hasDbName: function(dbName) {
                if (TiHelpers.safeString(dbName).trim().length > 0) {
                    settings.storageName = dbName;
                    return true;
                }
                return TiHelpers.safeString(settings.storageName).trim().length > 0;
            }
        };
        var root = function() {
            var iAPI = TAFFY.mergeObj(TAFFY.mergeObj(API, {
                insert: void 0
            }), {
                getSettings: function() {
                    return settings;
                },
                getDBI: function() {
                    return DBI;
                },
                getroot: function(c) {
                    return root.call(c);
                },
                context: function(n) {
                    n && (context = TAFFY.mergeObj(context, "results" in n ? TAFFY.mergeObj(n, {
                        run: new Date(),
                        sort: new Date()
                    }) : n));
                    return context;
                },
                extend: void 0
            });
            var context = this && this.q ? this : {
                limit: false,
                start: false,
                q: [],
                filterRaw: [],
                index: [],
                order: [],
                results: false,
                run: null,
                sort: null
            };
            each(arguments, function(f) {
                isIndexable(f) ? context.index.push(f) : context.q.push(returnFilter(f));
                context.filterRaw.push(f);
            });
            return iAPI;
        };
        TC++;
        d && DBI.insert(d);
        root.insert = DBI.insert;
        root.TAFFY = true;
        root.sort = DBI.sort;
        root.name = settings.storageName;
        root.readSettings = function() {
            return settings;
        };
        root.settings = function(n) {
            if (n) {
                settings = TAFFY.mergeObj(settings, n);
                n.template && root().update(n.template);
            }
            return settings;
        };
        root.exists = function(name) {
            if (!helpers.hasDbName(name)) return false;
            return TiHelpers.taffyDbExists(settings.storageName, settings);
        };
        root.destroy = function(name) {
            if (!helpers.hasDbName(name)) throw "No db name provided";
            TiHelpers.deleteTaffyDb(settings.storageName, settings);
            DBI.resetDb();
            return;
        };
        root.open = function(name) {
            if (!helpers.hasDbName(name)) throw "No db name provided";
            var d = TiHelpers.readTaffyDb(name, settings);
            DBI.resetDb();
            DBI.insert(d);
            dirtyTransCount = 0;
            return root;
        };
        root.commit = function() {
            var dbName = TiHelpers.safeString(settings.storageName).trim();
            if (0 === dbName.length) return;
            root.save(dbName);
        };
        root.save = function(name) {
            if (TiHelpers.safeString(name).trim().length > 0) settings.storageName = name; else if (0 === TiHelpers.safeString(settings.storageName).trim().length) throw "No db name provided";
            TOb.length > 0 ? TiHelpers.saveTaffyDb(settings.storageName, TOb, settings) : dirtyTransCount > 0 && TiHelpers.deleteTaffyDb(settings.storageName, settings);
            dirtyTransCount = 0;
            return root;
        };
        return root;
    };
    TAFFY = T;
    T.each = each;
    T.eachin = eachin;
    T.extend = API.extend;
    TAFFY.EXIT = "TAFFYEXIT";
    TAFFY.mergeObj = function(ob1, ob2) {
        var c = {};
        eachin(ob1, function(v, n) {
            c[n] = ob1[n];
        });
        eachin(ob2, function(v, n) {
            c[n] = ob2[n];
        });
        return c;
    };
    TAFFY.has = function(var1, var2) {
        var re = true;
        if (var1.TAFFY) {
            re = var1(var2);
            return re.length > 0 ? true : false;
        }
        switch (T.typeOf(var1)) {
          case "object":
            if (T.isObject(var2)) eachin(var2, function(v, n) {
                if (true !== re || T.isUndefined(var1[n]) || !var1.hasOwnProperty(n)) {
                    re = false;
                    return TAFFY.EXIT;
                }
                re = T.has(var1[n], var2[n]);
            }); else if (T.isArray(var2)) each(var2, function(v, n) {
                re = T.has(var1, var2[n]);
                if (re) return TAFFY.EXIT;
            }); else if (T.isString(var2)) return TAFFY.isUndefined(var1[var2]) ? false : true;
            return re;

          case "array":
            if (T.isObject(var2)) each(var1, function(v, i) {
                re = T.has(var1[i], var2);
                if (true === re) return TAFFY.EXIT;
            }); else if (T.isArray(var2)) each(var2, function(v2, i2) {
                each(var1, function(v1, i1) {
                    re = T.has(var1[i1], var2[i2]);
                    if (true === re) return TAFFY.EXIT;
                });
                if (true === re) return TAFFY.EXIT;
            }); else if (T.isString(var2) || T.isNumber(var2)) for (var n = 0; var1.length > n; n++) {
                re = T.has(var1[n], var2);
                if (re) return true;
            }
            return re;

          case "string":
            if (T.isString(var2) && var2 === var1) return true;
            break;

          default:
            if (T.typeOf(var1) === T.typeOf(var2) && var1 === var2) return true;
        }
        return false;
    };
    TAFFY.hasAll = function(var1, var2) {
        var T = TAFFY;
        if (T.isArray(var2)) {
            var ar = true;
            each(var2, function(v) {
                ar = T.has(var1, v);
                if (false === ar) return TAFFY.EXIT;
            });
            return ar;
        }
        return T.has(var1, var2);
    };
    TAFFY.typeOf = function(v) {
        var s = typeof v;
        "object" === s && (v ? "number" != typeof v.length || v.propertyIsEnumerable("length") || (s = "array") : s = "null");
        return s;
    };
    TAFFY.getObjectKeys = function(ob) {
        var kA = [];
        eachin(ob, function(n, h) {
            kA.push(h);
        });
        kA.sort();
        return kA;
    };
    TAFFY.isSameArray = function(ar1, ar2) {
        return TAFFY.isArray(ar1) && TAFFY.isArray(ar2) && ar1.join(",") === ar2.join(",") ? true : false;
    };
    TAFFY.isSameObject = function(ob1, ob2) {
        var T = TAFFY, rv = true;
        T.isObject(ob1) && T.isObject(ob2) ? T.isSameArray(T.getObjectKeys(ob1), T.getObjectKeys(ob2)) ? eachin(ob1, function(v, n) {
            if (!(T.isObject(ob1[n]) && T.isObject(ob2[n]) && T.isSameObject(ob1[n], ob2[n]) || T.isArray(ob1[n]) && T.isArray(ob2[n]) && T.isSameArray(ob1[n], ob2[n]) || ob1[n] === ob2[n])) {
                rv = false;
                return TAFFY.EXIT;
            }
        }) : rv = false : rv = false;
        return rv;
    };
    (function(ts) {
        for (var z = 0; ts.length > z; z++) (function(y) {
            TAFFY["is" + y] = function(c) {
                return TAFFY.typeOf(c) === y.toLowerCase() ? true : false;
            };
        })(ts[z]);
    })([ "String", "Number", "Object", "Array", "Boolean", "Null", "Function", "Undefined" ]);
})();

exports.taffyDb = TAFFY;