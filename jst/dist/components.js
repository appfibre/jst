"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var transform_1 = require("./transform");
var promise_1 = require("./promise");
function Inject(app, Context, Resolve, Proxy, JstContext) {
    var Component = Proxy || app.ui.Component;
    var Loader = /** @class */ (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Loader.prototype.load = function () {
            var _this = this;
            JstContext.load(this.state.url, true).then(function (obj) { _this.setState({ children: obj }); }, function (err) { _this.setState({ children: ["Exception", err] }); });
        };
        Loader.prototype.componentWillMount = function () {
            this.componentWillUpdate({}, this.props);
        };
        Loader.prototype.componentWillUpdate = function (props, nextprops) {
            this.checkurl(nextprops);
        };
        Loader.prototype.shouldComponentUpdate = function (props) {
            return this.checkurl(props);
        };
        Loader.prototype.checkurl = function (props) {
            var url = typeof props.url === "function" ? props.url() : props.url;
            if (!this.state || this.state.url !== url)
                this.setState({ children: this.props.children, url: url }, this.load);
            return !this.state || this.state.url === url;
        };
        Loader.prototype.render = function () {
            return _super.prototype.render.call(this, this.checkurl(this.props) && this.state.children && this.state.children.length > 0 ? this.state.children : this.props.children);
        };
        return Loader;
    }(Component));
    /*let { title, designer, ui, target, ...inject } = app;
    return { Component
        , Context
        , Loader
        , components : app.components
        , ...inject
    };*/
    var inj = {
        Component: Component,
        Context: Context,
        Loader: Loader,
        Resolve: Resolve,
        State: Context.state,
        components: app.components
    };
    var keys = Object.keys(app);
    for (var i in keys)
        if (keys[i] != "title" && keys[i] != "designer" && keys[i] != "ui" && keys[i] != "target")
            Object.defineProperty(inj, keys[i], Object.getOwnPropertyDescriptor(app, keys[i]) || {});
    return inj;
}
exports.Inject = Inject;
function xhr(url, parse) {
    function parseContent(rq, resolve, reject) {
        var contentType = rq.getResponseHeader("content-type");
        if (contentType && (contentType.substr(0, "application/json".length) == "application/json" || contentType.substr(0, "null;".length) == "null;")) {
            //var output = require('@appfibre/jst').transform(JSON.parse(rq.responseText));
            transform_1.transformAsync(JSON.parse(rq.responseText), {}, function (output) { resolve(eval("[" + output + "]")[0]); }, reject);
        }
        return resolve(eval(rq.responseText));
    }
    return new promise_1.Promise(function (resolve, reject) {
        try {
            var rq = new XMLHttpRequest();
            rq.open('get', url, true, null, null);
            rq.onloadend = function () {
                if (rq.status == 200) {
                    try {
                        if (parse)
                            resolve(rq.responseText);
                        else
                            parseContent(rq, resolve, reject);
                    }
                    catch (e) {
                        reject(new Error("Unable to parse response from: " + url + ", error: " + e.message));
                    }
                }
                else
                    reject(rq.responseText);
            };
            rq.send();
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.xhr = xhr;
