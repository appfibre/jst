import { IAppSettings, IContext } from "./types"
import { Inject } from "./components"
import { JstContext } from "./JstContext"
import { Intercept } from "./intercept";
import { Promise } from "./promise";
 
export function app (app:IAppSettings) : any {
    var jstContext = new JstContext({requireAsync: true});
    const _context :IContext = { state: app.defaultState || {}};
    
    
    function _construct(jstComponent : any) : any {
        return class extends jstComponent {
            render(obj : any) {
                if (Array.isArray(obj) && obj.length === 1 && !Array.isArray(obj[0])) return typeof obj[0] == "string" ? parse(obj) : obj[0];
                return obj == null || typeof obj === "string" || obj.$$typeof ? obj : parse(obj);
            }
        }
    }

    function getFunctionName(obj:any):string{
        if (obj.name)
            return obj.name;
        var name = obj.toString();
        if (name.indexOf('(') > -1)
            name = name.substr(0, name.indexOf('('));
        if (name.indexOf('function') > -1)
            name = name.substr(name.indexOf('function') + 'function'.length);
        return name.trim();
    }

    var _cache = Object();

    function _locate(resource:any, path:string) {
        var parts = path.split('.');
        var jst = false;
        var obj = resource;
        for (var part = 0; part < parts.length; part++)
            if (obj[parts[part]] !== undefined) {
                if (part == path.length-1) jst = obj.__jst;
                obj = obj[path[part]];
            } else
                obj = null;  
        return obj;
    }

    function Resolve(fullpath:string) : any {
        if (_cache[fullpath])  return _cache[fullpath];
        if (fullpath.substring(0, 1) == "~") {
            var parts = fullpath.substring(1, fullpath.length).split('#');
            //var obj = AppContext.xhr(parts[0], true);
            var obj = jstContext.load(parts[0], true);
            if (parts.length == 1)
                return obj;
            
            return obj.then(x => _locate(x, parts.slice(1, parts.length).join(".")));
        } else {
            let path = fullpath.split('.');
            let obj:any = app.components || Object;
            let jst = false;
            let prop = "default";
            
            for (var part = 0; part < path.length; part++) {
                if (typeof obj === "function" && getFunctionName(obj) === "inject")
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
                        return function transform(obj:any):any { return ["pre", {"style":{"color":"red"}}, obj[1].stack ? obj[1].stack : obj[1]]; }
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
            
            if (typeof obj == "function" /*&& !(obj.prototype.render)*/ && getFunctionName(obj) === "inject") // function Component injection
                //obj = obj( { Component: class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}, components: app.components, createElement: _createElement, language: "TEST" });
                obj = obj(Inject(app, _context, Resolve, jst ? class Component extends app.ui.Component { render(obj:any):any { return parse(app.designer ? [Intercept, {"file": jst, "method": prop}, _construct(app.ui.Component)] : obj); }} : _construct(app.ui.Component), jstContext));

            return _cache[fullpath] = Array.isArray(obj) ? class Wrapper extends app.ui.Component { shouldComponentUpdate() { return true; } render() {if (!obj[1]) obj[1] = {}; if   (!obj[1].key) obj[1].key = 0; return parse(jst && app.designer ? [Intercept, {"file": jst, "method": prop}, obj] : obj); }} : obj;
        }
    } 


    function processElement(ar : Array<any>, supportAsync?: boolean, light?:boolean) {
        var done = false;
        while (!done) {
            if (typeof ar[0] === "function")
                switch (getFunctionName(ar[0])) {
                    case "inject": 
                        ar[0] = ar[0](Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
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
                    return new Promise((resolve:Function) => ar[0].then((x:any) => resolve(parse(x, ar[1].key, supportAsync))));
            } else if (ar[0] && ar[0].then && !supportAsync  && !light)
                return app.ui.processElement(Async, {"value": ar});
            else
                done = true;
        }
        return light ? ar : app.ui.processElement.apply(Object(), ar);
    }

    function parse(obj:any, key?:number|undefined, supportAsync?:boolean):any {  
        if (Array.isArray(obj)) {
            if (key && !obj[1]) obj[1] = {key:key};
            if (key && !obj[1].key) obj[1].key = key;
        }
        else
            obj = [obj, key ? {key:key} : null];

        var isAsync = false;

        for (var idx = 0; idx < obj.length; idx++)
            if (Array.isArray(obj[idx])) {
                for (var i = 0; i < obj[idx].length; i++) {
                    if (Array.isArray(obj[idx][i]) || typeof obj[idx][i] === "function" || typeof  obj[idx][i] === "object" ) {
                        if (typeof obj[idx][i] === "function" || Array.isArray(obj[idx][i])) obj[idx][i] = (idx==2) ? parse(obj[idx][i], undefined, supportAsync) : processElement(obj[idx][i], supportAsync, true);
                        if (obj[idx][i].then) isAsync = true;
                    } else if (idx == 2)
                        throw new Error(`Expected either double array or string for children Parent:${String(obj[0])}, Child:${JSON.stringify(obj[idx][i], (key,value) => typeof value === "function" ? String(value) : value)}`);
                }
            }
        //if (isAsync && !obj[idx].then) obj[idx] = new Promise((resolve,reject) => Promise.all(obj[idx]).then(output => resolve(output), reason => reject(reason)));
        if (isAsync) for (var idx = 0; idx < obj.length; idx++) if (!obj[idx].then) obj[idx] = Promise.all(obj[idx]);
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
        
        return isAsync ? new Promise((resolve:any) => Promise.all(obj).then(o => resolve(processElement(o, supportAsync)))) : processElement([obj[0], obj[1], obj[2]], supportAsync);
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

        setAppState(props:{}, callback?:Function) {
            if (props != null) {
                var keys = Object.keys(props);
                for (var i in keys)
                    Object.defineProperty(_context.state, keys[i], Object.getOwnPropertyDescriptor(props, keys[i])||{});
            }
            this.setState(props, () => {
                    if (app.stateChanged) app.stateChanged.call(this);
                    if (callback) callback();
                });
        }

        render() {
            return super.render(this.props.children);
        }
    }

    class Async extends _construct(app.ui.Component)
    {
        constructor(props:any)
        {
            super(props);
            this.state = {
            value: this.props.value[3],
            };
        }

        componentDidMount() {
            if (Promise.prototype.isPrototypeOf(this.props.value))
                this.props.value.then((value:any) => this.setState({"value": value }), (err:string) =>  this.setState({"value": this.props.value[4] ? this.props.value[4](err) : ["Exception", err]}));
            else if (this.props.value[0] && this.props.value[0].then)
                this.props.value[0].then((value:any) => this.setState({"value": value }), (err:string) =>  this.setState({"value": this.props.value[4] ? this.props.value[4](err) : ["Exception", err]}));
            else
                Promise.all(this.props.value).then(value => this.setState({"value":value})).catch(err => { if (this.props.value[4]) this.setState({"value": this.props.value[4]})});
        }

        render() {
            return this.state.value && typeof this.state.value !== "string" ? super.render(this.state.value) : "";
        }
    }


    var ui = app.app;
    if (app.designer)
        ui = [(window.parent === null || window === window.parent) ? app.designer : Intercept, app ? { file: app.app ? 'todo'/*app.app.__jst*/ : null } : {}, ui];

    if (typeof ui === "function" && !ui.prototype.render) ui = ui(Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));

    var mapRecursive:any = (obj:any) => Array.isArray(obj) ? obj.map(t => mapRecursive(t)) : obj;
    if (Array.isArray(ui)) ui = mapRecursive(ui);


    function render(ui:any, resolve?:any, reject?:any) {
        var target:string|HTMLElement|null = app.target || document.body;
        if (document && target === document.body) {
            target = document.getElementById("main") || document.body.appendChild(document.createElement("div"));
            if (!target.id) target.setAttribute("id", "main");
        } else if (typeof target === "string")
            target = document.getElementById(target);
        if (target == null) throw new Error(`Cannot locate target (${target?'not specified':target}) in html document body.`);
        if (app.title) document.title = app.title;
        //if (module && module.hot) module.hot.accept();

        if (target.hasChildNodes()) target.innerHTML = "";
        (resolve) ? resolve(app.ui.render(processElement([App, _context, ui]), target)) : app.ui.render(processElement([App, _context, ui]), target);
    }

    function init(ui:any, resolve?:any, reject?:any) {
        if (app.target != null && app.target && typeof app.target !== "string")
            render(ui, resolve, reject);
        else if (document)
        { 
            if (!document.body)
                document.addEventListener("DOMContentLoaded", function(event) { render(ui, resolve, reject) });
            else
                render(ui, resolve, reject);
        } else if (reject)
            reject ("Cannot locate document object to ")
    }

    if (app.async) {
        return new Promise(function(resolve:any, reject:any) {
            var parsed = parse(ui, undefined, true);
            if (parsed && parsed.then) 
                parsed.then((parsed:any) => init(parsed), resolve, reject);
            else
                init(parsed, resolve, reject);
        });
    } 
    else
        init(parse(ui));
   
}
