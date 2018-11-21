"use strict";
exports.__esModule = true;
var transform_1 = require("./transform");
var promise_1 = require("./promise");
var JstContext = /** @class */ (function () {
    function JstContext(settings) {
        this._cache = Object();
        this._transform = transform_1.transformAsync.bind(this);
        this._settings = settings;
        this.run = this.run.bind(this);
    }
    JstContext.prototype._require = function (url) {
        var _this = this;
        return new promise_1.Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true, null, null);
            xhr.onloadend = function () {
                if (xhr.status == 200) {
                    _this.run(xhr.responseText).then(function (output) {
                        _this._cache[url] = output;
                        resolve.call(output);
                        return output;
                    }, reject); //reason => reject(reason)
                }
                else
                    reject(xhr.responseText);
            };
            xhr.send();
        });
    };
    JstContext.prototype.run = function (str) {
        var _req = this._require.bind(this);
        function require(url) {
            return _req(url);
        }
        ;
        return new promise_1.Promise(function (resolve, reject) {
            try {
                var response = eval("(async function run() {return " + str + "})()");
                if (response.then)
                    response.then(resolve, reject); //.then(output => {resolve(output)}, reason => reject(reason));
                else
                    resolve(response);
            }
            catch (e) {
                reject(e.stack);
            }
        });
    };
    JstContext.prototype.load = function (url, parse) {
        var _this = this;
        return new promise_1.Promise(function (resolve, reject) {
            var run = _this.run.bind(_this);
            var transform = _this._transform.bind(_this);
            try {
                var rq = new XMLHttpRequest();
                rq.open('get', url, true, null, null);
                rq.onloadend = function () {
                    if (rq.status == 200) {
                        if (parse) {
                            var contentType = rq.getResponseHeader("content-type");
                            if (!contentType || contentType.substring(0, "application/json".length) == "application/json" || contentType.substring(0, "application/jst".length) == "application/jst" || contentType.substring(0, "null;".length) == "null;")
                                transform(JSON.parse(rq.responseText), { "async": true }, function (output) { run(output).then(resolve, reject); }, reject);
                            //run(transform(JSON.parse(rq.responseText), { "async" : true})).then(resolve, reject); // .then(output => resolve(output), reason => reject(reason));
                            else {
                                try {
                                    resolve(eval(rq.responseText));
                                }
                                catch (e) {
                                    reject(new Error("Unable to parse response from: " + url + ", error: " + e.message));
                                }
                            }
                        }
                        else
                            resolve(rq.responseText);
                    }
                    else
                        reject("Could not locate " + (url));
                };
                rq.send();
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return JstContext;
}());
exports.JstContext = JstContext;
