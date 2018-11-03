module.exports = function (app) {
    const _context = {};
    
    function _construct(parent) {
        return class extends parent {
            render(obj) {
                if (Array.isArray(obj) && obj.length === 1 && !Array.isArray(obj[0])) return typeof obj[0] == "string" ? parse(obj) : obj[0];
                return obj == null || typeof obj === "string" || obj.$$typeof ? obj : parse(obj);
            }
        }
    }

    function _inject(component) {
        app.Component = component || _construct(Component);
        app.AppContext = _context;
        return app;
    }

    var _cache = {};
    function _load(fullpath) {
        if (_cache[fullpath])  return _cache[fullpath];
        let path = fullpath.split('.');
        let obj = app.components || {};
        let jst = null;
        let prop = "default";
        for (var part in path) {
            if (typeof obj === "function" /*&& !obj.prototype.render*/ && obj.name === "inject")
                    //obj = obj( _inject( app.designer ? class Component extends app.ui.Component { render(obj) { return parse(jst ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}:obj));
                    obj = obj(_inject(_construct(app.ui.Component)));
            
            if (obj[path[part]] !== undefined) {
                if (part == path.length-1) jst = obj.__jst;
                obj = obj[path[part]];
            }
            else if (path.length == 1 && path[0].toLowerCase() == path[0])
                obj = path[part];
            else {
                console.error('Cannot load ' + fullpath);
                return class extends app.ui.Component { render () { return parse(["span", {"style":{"color":"red"}}, `${fullpath} not found!`]) }};
            }
        }

        if (obj.__esModule && obj.default) {
            jst = obj.__jst;
            obj = obj.default;
        } else if (jst)
            prop = path[path.length-1];
        
        if (typeof obj == "function" /*&& !(obj.prototype.render)*/ && obj.name === "inject") // function Component injection
            //obj = obj( { Component: class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}, components: app.components, createElement: _createElement, language: "TEST" });
            obj = obj(_inject( jst ? class Component extends app.ui.Component { render(obj) { return parse(app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, _construct(app.ui.Component)] : obj); }} : _construct(app.ui.Component)));

        return _cache[fullpath] = Array.isArray(obj) ? class Wrapper extends app.ui.Component { shouldComponentUpdate() { return true; } render() {if (!obj[1]) obj[1] = {}; if   (!obj[1].key) obj[1].key = 0; return parse(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }} : obj;
    } 


    function processElement(tag, attributes, children) {
        if (typeof tag === "function" /*&& !_isClass(tag) && !tag.prototype.render*/ && tag.name === "inject") tag = tag(_inject(_construct(app.ui.Component)));
        if (typeof tag === "string") tag = _load(tag);
        if (typeof tag === "function" && Array.isArray(children)) {
            if (children.length > 1) {
                console.warn("Class/function tags cannot have more than one direct child elements, wrapping elements in a div tag");
                return app.ui.processElement(tag, attributes, processElement("div", {}, children));
            } 
            else { 
                children = children[0];
            }
        }
        return app.ui.processElement(tag, attributes, Array.isArray(children)?children:children?children:null);
    }

    function parse(obj, key) {  
        if (Array.isArray(obj)) {
            if (!obj[1]) obj[1] = {};
            if (!obj[1].key) obj[1].key = key;

            if (Array.isArray(obj[2])) {
                obj[2] = obj[2].map(child => typeof child === "function" && child.name === "inject" ? child(_construct(app.ui.Component)):child);
                
                obj[2].forEach(element => {
                    if (!Array.isArray(element))
                        throw new Error(`Expected double array or string for children Parent:${String(obj[0])}, Child:${JSON.stringify(element, (key,value) => typeof value === "function" ? String(value) : value)}`);    
                });
            }

            return processElement(obj[0], obj[1], Array.isArray(obj[2]) ? obj[2].map((element, index) =>  parse(element, index+1)) : obj[2]);
        }
        else 
           return processElement(obj, key ? {key: key} : null);
    }

    var target = app.target || document.body;
    if (target === document.body) {
        target = document.getElementById("main") || document.body.appendChild(document.createElement("div"));
        if (!target.id) target.setAttribute("id", "main");
    } else if (typeof target === "string")
        target = document.getElementById(target);
    if (target == null) throw new Error(`Cannot locate target (${target?'not specified':target}) in html document body.`);
    if (target.hasChildNodes()) target.innerHTML = "";
    if (app.title) document.title = app.title;
    if (module && module.hot) module.hot.accept();

    var ui = app.app;
    if (app.designer)
        ui = [(window.parent === null || window === window.parent) ? app.designer : require('@appfibre/jst/intercept.js').default, app ? { file: app.app ? app.app.__jst : null } : {}, ui];

    if (typeof ui === "function" && !ui.prototype.render) ui = ui(_inject(_construct(app.ui.Component)));
    app.ui.render(parse(ui), target);
}

