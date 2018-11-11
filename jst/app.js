module.exports = async function (app) {
    var Inject = require('./components.js').Inject;
    var jstContext = new (require('./context').default)();
    const _context = { state: app.defaultState || {}};
    
    function _construct(parent) {
        return class extends parent {
            render(obj) {
                if (Array.isArray(obj) && obj.length === 1 && !Array.isArray(obj[0])) return typeof obj[0] == "string" ? parse(obj) : obj[0];
                return obj == null || typeof obj === "string" || obj.$$typeof ? obj : parse(obj);
            }
        }
    }

    var _cache = {};

    function _locate(resource, path) {
        var parts = path.split('.');
        var jst = false;
        var obj = resource;
        for (var part in parts)
            if (obj[parts[part]] !== undefined) {
                if (part == path.length-1) jst = obj.__jst;
                obj = obj[path[part]];
            } else
                obj = null;  
        return obj;
    }

    function Resolve(fullpath) {
        if (_cache[fullpath])  return _cache[fullpath];
        if (fullpath.startsWith("~")) {
            var parts = fullpath.substring(1, fullpath.length).split('#');
            //var obj = AppContext.xhr(parts[0], true);
            var obj = jstContext.load(parts[0], true);
            if (parts.length == 1)
                return obj;
            
            return obj.then(x => _locate(x, parts.slice(1, parts.length).join(".")));
        } else {
            let path = fullpath.split('.');
            let obj = app.components || {};
            let jst = null;
            let prop = "default";
            for (var part in path) {
                if (typeof obj === "function" && obj.name === "inject")
                        //obj = obj( Inject( app.designer ? class Component extends app.ui.Component { render(obj) { return parse(jst ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}:obj));
                        obj = obj(Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
                
                if (obj[path[part]] !== undefined) {
                    if (part == path.length-1) jst = obj.__jst;
                    obj = obj[path[part]];
                }
                else if (path.length == 1 && path[0].toLowerCase() == path[0])
                    obj = path[part];
                else {
                    if (fullpath === "Exception")
                        return function transform(obj) { return ["pre", {"style":{"color":"red"}}, obj[1].stack ? obj[1].stack : obj[1]]; }
                    else {
                        console.error('Cannot load ' + fullpath);
                        return class extends app.ui.Component { render () { return parse(["span", {"style":{"color":"red"}}, `${fullpath} not found!`]) }};
                    }
                }
            }

            if (obj.__esModule && obj.default) {
                jst = obj.__jst;
                obj = obj.default;
            } else if (jst)
                prop = path[path.length-1];
            
            if (typeof obj == "function" /*&& !(obj.prototype.render)*/ && obj.name === "inject") // function Component injection
                //obj = obj( { Component: class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}, components: app.components, createElement: _createElement, language: "TEST" });
                obj = obj(Inject(app, _context, Resolve, jst ? class Component extends app.ui.Component { render(obj) { return parse(app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, _construct(app.ui.Component)] : obj); }} : _construct(app.ui.Component), jstContext));

            return _cache[fullpath] = Array.isArray(obj) ? class Wrapper extends app.ui.Component { shouldComponentUpdate() { return true; } render() {if (!obj[1]) obj[1] = {}; if   (!obj[1].key) obj[1].key = 0; return parse(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }} : obj;
        }
    } 


    function processElement(ar, supportAsync, light) {
        var done = false;
        while (!done) {
            if (typeof ar[0] === "function")
                switch (ar[0].name) {
                    case "inject": 
                        ar[0] = ar[0](Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
                        break;
                    case "transform":
                        return parse(ar[0](ar), supportAsync);
                    default:
                        done = true;
                }
            else if (typeof ar[0] === "string") {
                var tag = ar[0];
                ar[0] = Resolve(ar[0]);
                done = ar[0] === tag;
                if (ar[0].then && supportAsync && !light)
                    return new Promise( resolve => ar[0].then(x => resolve(parse(x, ar[1].key, supportAsync))));
            } else if (ar[0] && ar[0].then && !supportAsync  && !light)
                return app.ui.processElement(Async, {"value": ar}, supportAsync);
            else
                done = true;
        }
        return light ? ar : app.ui.processElement.apply(this, ar);
    }

    function parse(obj, key, supportAsync) {  
        if (Array.isArray(obj)) {
            if (key && !obj[1]) obj[1] = {key:key};
            if (key && !obj[1].key) obj[1].key = key;
        }
        else
            obj = [obj, key ? {key:key} : null];

        var isAsync = false;

        for (var idx in obj)
            if (Array.isArray(obj[idx])) {
                for (var i in obj[idx]) {
                    if (Array.isArray(obj[idx][i]) || typeof obj[idx][i] === "function" || typeof  obj[idx][i] === "object" ) {
                        if (typeof obj[idx][i] === "function" || Array.isArray(obj[idx][i])) obj[idx][i] = (idx==2) ? parse(obj[idx][i], [idx == 1] ? i+1 : null, supportAsync) : processElement(obj[idx][i], supportAsync, true);
                        if (obj[idx][i].then) isAsync = true;
                    } else if (idx == 2)
                        throw new Error(`Expected either double array or string for children Parent:${String(obj[0])}, Child:${JSON.stringify(obj[idx][i], (key,value) => typeof value === "function" ? String(value) : value)}`);
                }
            }
        //if (isAsync && !obj[idx].then) obj[idx] = new Promise((resolve,reject) => Promise.all(obj[idx]).then(output => resolve(output), reason => reject(reason)));
        if (isAsync) for (var idx in obj) if (!obj[idx].then) obj[idx] = Promise.all(obj[idx]);
        if (!isAsync && ((typeof obj[0] === "function" &&  obj[0].then) || (typeof obj[1] === "function" &&  obj[1].then))) isAsync = true;

        if (!isAsync) {
            obj = processElement(obj, supportAsync);
            if (typeof obj === 'function' && obj.then && !supportAsync) 
                return  processElement([Async, {value: obj}], supportAsync);
            else 
                return obj;
        }

        if (!supportAsync && isAsync) 
            return processElement([Async, {value: Promise.all(obj).then(o => processElement(o, supportAsync))}]);
        
        return isAsync ? new Promise(resolve => Promise.all(obj).then(o => resolve(processElement(o, supportAsync)))) : processElement([obj[0], obj1, obj[2]], supportAsync);
    }

    class App extends _construct(app.ui.Component)
    {
        constructor() 
        {
            super();
            _context.setState = this.setAppState.bind(this);
        }

        componentWillMount(){
            this.setState( _context.state, () => {
                if (app.stateChanged) app.stateChanged.call(this);
            });
        }

        setAppState(props, callback) {
            if (props != null) {
                var keys = Object.keys(props);
                for (var i in keys)
                    Object.defineProperty(_context.state, keys[i], Object.getOwnPropertyDescriptor(props, keys[i]));
            }
            this.setState(props, () => {
                    if (app.stateChanged) app.stateChanged.call(this);
                    if (callback) callback.call();
                });
        }

        render() {
            return super.render(this.props.children);
        }
    }

    class Async extends _construct(app.ui.Component)
    {
        constructor(props)
        {
            super(props);
            this.state = {
            value: this.props.value[3],
            };
        }

        componentDidMount() {
            if (Promise.prototype.isPrototypeOf(this.props.value))
                this.props.value.then(value => this.setState({"value": value }), err =>  this.setState({"value": this.props.value[4] ? this.props.value[4](err) : ["Exception", err]}));
            else if (this.props.value[0] && this.props.value[0].then)
                this.props.value[0].then(value => this.setState({"value": value }), err =>  this.setState({"value": this.props.value[4] ? this.props.value[4](err) : ["Exception", err]}));
            else
                Promise.all(this.props.value).then(value => this.setState({"value":value})).catch(err => { if (this.props.value[4]) this.setState({"value": this.props.value[4]})});
        }

        render() {
            return this.state.value && typeof this.state.value !== "string" ? super.render(this.state.value) : "";
        }
    }


    var ui = app.app;
    if (app.designer)
        ui = [(window.parent === null || window === window.parent) ? app.designer : require('@appfibre/jst/intercept.js').default, app ? { file: app.app ? app.app.__jst : null } : {}, ui];

    if (typeof ui === "function" && !ui.prototype.render) ui = ui(Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));

    var mapRecursive = obj => Array.isArray(obj) ? obj.map(t => mapRecursive(t)) : obj;
    if (Array.isArray(ui)) ui = mapRecursive(ui);

    ui = app.async ? await parse(ui, null, true) : parse (ui);
    //ui = parse(ui);
    
    document.addEventListener("DOMContentLoaded", function(event) { 

        var target = app.target || document.body;
        if (target === document.body) {
            target = document.getElementById("main") || document.body.appendChild(document.createElement("div"));
            if (!target.id) target.setAttribute("id", "main");
        } else if (typeof target === "string")
            target = document.getElementById(target);
        if (target == null) throw new Error(`Cannot locate target (${target?'not specified':target}) in html document body.`);
        if (app.title) document.title = app.title;
        if (module && module.hot) module.hot.accept();

        if (target.hasChildNodes()) target.innerHTML = "";
        app.ui.render(processElement([App, _context, ui]), target);
    });

}