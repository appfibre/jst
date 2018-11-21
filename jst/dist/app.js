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
var components_1 = require("./components");
var JstContext_1 = require("./JstContext");
var intercept_1 = require("./intercept");
var promise_1 = require("./promise");
function app(app) {
    var jstContext = new JstContext_1.JstContext({ requireAsync: true });
    var _context = { state: app.defaultState || {} };
    function _construct(jstComponent) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.render = function (obj) {
                if (Array.isArray(obj) && obj.length === 1 && !Array.isArray(obj[0]))
                    return typeof obj[0] == "string" ? parse(obj) : obj[0];
                return obj == null || typeof obj === "string" || obj.$$typeof ? obj : parse(obj);
            };
            return class_1;
        }(jstComponent));
    }
    var _cache = Object();
    function _locate(resource, path) {
        var parts = path.split('.');
        var jst = false;
        var obj = resource;
        for (var part = 0; part < parts.length; part++)
            if (obj[parts[part]] !== undefined) {
                if (part == path.length - 1)
                    jst = obj.__jst;
                obj = obj[path[part]];
            }
            else
                obj = null;
        return obj;
    }
    function Resolve(fullpath) {
        if (_cache[fullpath])
            return _cache[fullpath];
        if (fullpath.substring(0, 1) == "~") {
            var parts = fullpath.substring(1, fullpath.length).split('#');
            //var obj = AppContext.xhr(parts[0], true);
            var obj = jstContext.load(parts[0], true);
            if (parts.length == 1)
                return obj;
            return obj.then(function (x) { return _locate(x, parts.slice(1, parts.length).join(".")); });
        }
        else {
            var path = fullpath.split('.');
            var obj_1 = app.components || Object;
            var jst_1 = false;
            var prop_1 = "default";
            for (var part = 0; part < path.length; part++) {
                if (typeof obj_1 === "function" && obj_1.name === "inject")
                    //obj = obj( Inject( app.designer ? class Component extends app.ui.Component { render(obj) { return parse(jst ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}:obj));
                    obj_1 = obj_1(components_1.Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
                if (obj_1[path[part]] !== undefined) {
                    if (part == path.length - 1)
                        jst_1 = obj_1.__jst;
                    obj_1 = obj_1[path[part]];
                }
                else if (path.length == 1 && path[0].toLowerCase() == path[0])
                    obj_1 = path[part];
                else {
                    if (fullpath === "Exception")
                        return function transform(obj) { return ["pre", { "style": { "color": "red" } }, obj[1].stack ? obj[1].stack : obj[1]]; };
                    else {
                        console.error('Cannot load ' + fullpath);
                        return /** @class */ (function (_super) {
                            __extends(class_2, _super);
                            function class_2() {
                                return _super !== null && _super.apply(this, arguments) || this;
                            }
                            class_2.prototype.render = function () { return parse(["span", { "style": { "color": "red" } }, fullpath + " not found!"]); };
                            return class_2;
                        }(app.ui.Component));
                    }
                }
            }
            if (obj_1.__esModule && obj_1["default"]) {
                jst_1 = obj_1.__jst;
                obj_1 = obj_1["default"];
            }
            else if (jst_1)
                prop_1 = path[path.length - 1];
            if (typeof obj_1 == "function" /*&& !(obj.prototype.render)*/ && obj_1.name === "inject") // function Component injection
                //obj = obj( { Component: class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}, components: app.components, createElement: _createElement, language: "TEST" });
                obj_1 = obj_1(components_1.Inject(app, _context, Resolve, jst_1 ? /** @class */ (function (_super) {
                    __extends(Component, _super);
                    function Component() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Component.prototype.render = function (obj) { return parse(app.designer ? [intercept_1.Intercept, { "file": jst_1, "method": prop_1 }, _construct(app.ui.Component)] : obj); };
                    return Component;
                }(app.ui.Component)) : _construct(app.ui.Component), jstContext));
            return _cache[fullpath] = Array.isArray(obj_1) ? /** @class */ (function (_super) {
                __extends(Wrapper, _super);
                function Wrapper() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Wrapper.prototype.shouldComponentUpdate = function () { return true; };
                Wrapper.prototype.render = function () { if (!obj_1[1])
                    obj_1[1] = {}; if (!obj_1[1].key)
                    obj_1[1].key = 0; return parse(jst_1 && app.designer ? [intercept_1.Intercept, { "file": jst_1, "method": prop_1 }, obj_1] : obj_1); };
                return Wrapper;
            }(app.ui.Component)) : obj_1;
        }
    }
    function processElement(ar, supportAsync, light) {
        var done = false;
        while (!done) {
            if (typeof ar[0] === "function")
                switch (ar[0].name) {
                    case "inject":
                        ar[0] = ar[0](components_1.Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
                        break;
                    case "transform":
                        return parse(ar[0](ar), undefined, supportAsync);
                    default:
                        done = true;
                }
            else if (typeof ar[0] === "string") {
                var tag = ar[0];
                ar[0] = Resolve(ar[0]);
                done = ar[0] === tag;
                if (ar[0].then && supportAsync && !light)
                    return new promise_1.Promise(function (resolve) { return ar[0].then(function (x) { return resolve(parse(x, ar[1].key, supportAsync)); }); });
            }
            else if (ar[0] && ar[0].then && !supportAsync && !light)
                return app.ui.processElement(Async, { "value": ar });
            else
                done = true;
        }
        return light ? ar : app.ui.processElement.apply(Object(), ar);
    }
    function parse(obj, key, supportAsync) {
        if (Array.isArray(obj)) {
            if (key && !obj[1])
                obj[1] = { key: key };
            if (key && !obj[1].key)
                obj[1].key = key;
        }
        else
            obj = [obj, key ? { key: key } : null];
        var isAsync = false;
        for (var idx = 0; idx < obj.length; idx++)
            if (Array.isArray(obj[idx])) {
                for (var i = 0; i < obj[idx].length; i++) {
                    if (Array.isArray(obj[idx][i]) || typeof obj[idx][i] === "function" || typeof obj[idx][i] === "object") {
                        if (typeof obj[idx][i] === "function" || Array.isArray(obj[idx][i]))
                            obj[idx][i] = (idx == 2) ? parse(obj[idx][i], undefined, supportAsync) : processElement(obj[idx][i], supportAsync, true);
                        if (obj[idx][i].then)
                            isAsync = true;
                    }
                    else if (idx == 2)
                        throw new Error("Expected either double array or string for children Parent:" + String(obj[0]) + ", Child:" + JSON.stringify(obj[idx][i], function (key, value) { return typeof value === "function" ? String(value) : value; }));
                }
            }
        //if (isAsync && !obj[idx].then) obj[idx] = new Promise((resolve,reject) => Promise.all(obj[idx]).then(output => resolve(output), reason => reject(reason)));
        if (isAsync)
            for (var idx = 0; idx < obj.length; idx++)
                if (!obj[idx].then)
                    obj[idx] = promise_1.Promise.all(obj[idx]);
        if (!isAsync && ((typeof obj[0] === "function" && obj[0].then) || (typeof obj[1] === "function" && obj[1].then)))
            isAsync = true;
        if (!isAsync) {
            obj = processElement(obj, supportAsync);
            if (typeof obj === 'function' && obj.then && !supportAsync)
                return processElement([Async, { value: obj }], supportAsync);
            else
                return obj;
        }
        if (!supportAsync && isAsync)
            return processElement([Async, { value: promise_1.Promise.all(obj).then(function (o) { return processElement(o, supportAsync); }) }]);
        return isAsync ? new promise_1.Promise(function (resolve) { return promise_1.Promise.all(obj).then(function (o) { return resolve(processElement(o, supportAsync)); }); }) : processElement([obj[0], obj[1], obj[2]], supportAsync);
    }
    var App = /** @class */ (function (_super) {
        __extends(App, _super);
        function App() {
            var _this = _super.call(this) || this;
            _context.setState = _this.setAppState.bind(_this);
            return _this;
        }
        App.prototype.componentWillMount = function () {
            var _this = this;
            this.setState(_context.state, function () {
                if (app.stateChanged)
                    app.stateChanged.call(_this);
            });
        };
        App.prototype.setAppState = function (props, callback) {
            var _this = this;
            if (props != null) {
                var keys = Object.keys(props);
                for (var i in keys)
                    Object.defineProperty(_context.state, keys[i], Object.getOwnPropertyDescriptor(props, keys[i]) || {});
            }
            this.setState(props, function () {
                if (app.stateChanged)
                    app.stateChanged.call(_this);
                if (callback)
                    callback();
            });
        };
        App.prototype.render = function () {
            return _super.prototype.render.call(this, this.props.children);
        };
        return App;
    }(_construct(app.ui.Component)));
    var Async = /** @class */ (function (_super) {
        __extends(Async, _super);
        function Async(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                value: _this.props.value[3]
            };
            return _this;
        }
        Async.prototype.componentDidMount = function () {
            var _this = this;
            if (promise_1.Promise.prototype.isPrototypeOf(this.props.value))
                this.props.value.then(function (value) { return _this.setState({ "value": value }); }, function (err) { return _this.setState({ "value": _this.props.value[4] ? _this.props.value[4](err) : ["Exception", err] }); });
            else if (this.props.value[0] && this.props.value[0].then)
                this.props.value[0].then(function (value) { return _this.setState({ "value": value }); }, function (err) { return _this.setState({ "value": _this.props.value[4] ? _this.props.value[4](err) : ["Exception", err] }); });
            else
                promise_1.Promise.all(this.props.value).then(function (value) { return _this.setState({ "value": value }); })["catch"](function (err) { if (_this.props.value[4])
                    _this.setState({ "value": _this.props.value[4] }); });
        };
        Async.prototype.render = function () {
            return this.state.value && typeof this.state.value !== "string" ? _super.prototype.render.call(this, this.state.value) : "";
        };
        return Async;
    }(_construct(app.ui.Component)));
    var ui = app.app;
    if (app.designer)
        ui = [(window.parent === null || window === window.parent) ? app.designer : intercept_1.Intercept, app ? { file: app.app ? 'todo' /*app.app.__jst*/ : null } : {}, ui];
    if (typeof ui === "function" && !ui.prototype.render)
        ui = ui(components_1.Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
    var mapRecursive = function (obj) { return Array.isArray(obj) ? obj.map(function (t) { return mapRecursive(t); }) : obj; };
    if (Array.isArray(ui))
        ui = mapRecursive(ui);
    function onParsed(ui) {
        document.addEventListener("DOMContentLoaded", function (event) {
            var target = app.target || document.body;
            if (target === document.body) {
                target = document.getElementById("main") || document.body.appendChild(document.createElement("div"));
                if (!target.id)
                    target.setAttribute("id", "main");
            }
            else if (typeof target === "string")
                target = document.getElementById(target);
            if (target == null)
                throw new Error("Cannot locate target (" + (target ? 'not specified' : target) + ") in html document body.");
            if (app.title)
                document.title = app.title;
            //if (module && module.hot) module.hot.accept();
            if (target.hasChildNodes())
                target.innerHTML = "";
            app.ui.render(processElement([App, _context, ui]), target);
        });
    }
    (app.async) ? parse(ui, undefined, true).then(onParsed) : onParsed(parse(ui));
}
exports.app = app;
