import { createElement, createContext, Component, PureComponent } from 'react';
import { render } from 'react-dom';

function renderApp(app) {
    //const AppContext = createContext({SetState: 1});
    const _context = {};
    function isClass(func) {
        return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
    }
    function _construct(parent) {
        return class extends parent {
            render(obj) {
                return _createElement(obj, true);
            }
        }
    }

    function inject(component) {
        app.Component = component || _construct(Component);
        app.PureComponent = _construct(PureComponent);
        app.AppContext = _context;
        return app;

        //return {...app, Component: component || _construct(Component), PureComponent: _construct(PureComponent), AppContext : _context}
    }

    function _createElement (obj) {
        function _wrap(child, key) {
            if (!child) return null;
            if (typeof child === "function" && !isClass(child)) child = child(inject());
            
            if (typeof child == "string")
                return [child, key ? {"key": key} : null];
            else if (!Array.isArray(child)){
                /*if (isClass(child))*/ return child;
                //throw new Error("Expected class or array: " + JSON.stringify(child));
            }
    
            if (child[3]) 
                debugger;
                //to fix
                //return createElement(wrap_async, {value: child, key: key});
    
            //if (child[2] && Array.isArray(child[2]) && child[2].length > 0 && typeof child[2][0] === "string" )
            if (typeof child[0] === 'function') { 
                if (!isClass(child[0]) && !(child[0].prototype instanceof Component)) {
                    child[0] = child[0](inject());
                }
                if (Array.isArray(child[2])) 
                    child[2] = _wrap(child[2]);
            }

            if (typeof child === 'function')
                debugger;
                //to fix
                //return isClass(child) ? factory(child) : createElement.call(this, surrogateComponent, key ? {"key": key} : null, [child]);
            else if (Array.isArray(child[0]) && child.length == 1) {
                if (!child[0][1]) child[0][1] = {};
                if (!child[0][1].key) child[0][1].key = key ? key : 0;
                return _createElement(child[0]);
            }
            else {

                var name = child[0];
                if (typeof child[0] == "string")
                    child[0] = _load(child[0]);
                    
                if (child[2] && Array.isArray(child[2])) {
                    if (child[2].length > 0 && typeof child[0] === "string" &&  typeof child[2][0] === "string" )
                        console.error('Child argument (3) expected to be a double array: ' + JSON.stringify(child));
                    else if (typeof child[0] !== "string" && (Array.isArray(child[2][0]) || typeof child[2][0] !== "string" ))
                        console.error('Component expects a single child: ' + JSON.stringify([name, child[1], child[2]]));
                }

                if (typeof child[0] == "string") {
                    if (Array.isArray(child[2]))
                        for (var c in child[2]) 
                            if (typeof child[2][c] != "string")
                                child[2][c] = _wrap(child[2][c], c);
                } else if (Array.isArray(child[2])) 
                    child[2] = _wrap(child[2], 0);
                

                if (key && !child[1]) child[1] = {};
                if (key && !child[1].key) child[1]["key"] = key;

                return createElement( child[0]
                                    , child[1]
                                    , /*Array.isArray(child[2]) && child[2].length == 1 && typeof child[0] != "string" ? child[2][0] :*/ child[2]
                                    );
            }
        }
        
        return _wrap(obj);
    }

    var _cache = {};
    function _load(fullpath) {
        if (_cache[fullpath])  return _cache[fullpath];

        let path = fullpath.split('.');
        let obj = app.components || {};
        let jst = null;
        let prop = "default";
        for (var part in path) {
            if (typeof obj === "function" && !(obj.prototype instanceof Component))
                    obj = obj( inject( class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}));
            
            if (obj[path[part]] !== undefined) {
                if (part == path.length-1) jst = obj.__jst;
                obj = obj[path[part]];
            }
            else if (path.length == 1 && path[0].toLowerCase() == path[0])
                obj = path[part];
            else {
                console.error('Cannot load ' + fullpath);
                return class extends Component { render () { return createElement("div", {"style":{"color":"red"}}, `${fullpath} not found!`) }};
            }
        }

        if (obj.__esModule && obj.default) {
            jst = obj.__jst;
            obj = obj.default;
        } else if (jst)
            prop = path[path.length-1];
        
        if (typeof obj == "function" && !(obj.prototype instanceof Component)) // function Component injection
            //obj = obj( { Component: class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}, components: app.components, createElement: _createElement, language: "TEST" });
            obj = obj(inject(class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}));

        //return Array.isArray(obj) ? _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default(inject()), {"file": jst, "method": prop}, obj] : obj) : obj;

        return _cache[fullpath] = Array.isArray(obj) ? class Wrapper extends Component { shouldComponentUpdate() { return true; } render() {if (!obj[1]) obj[1] = {}; if   (!obj[1].key) obj[1].key = 0; return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }} : obj;
    } 

    class App extends Component {

        constructor() {
            super();
            _context.setState = function(state) { 
                _cache = {} 
                for (var key in state) {
                    app[key] = state[key];
                }
                this.setState({}); 
            }.bind(this);
        }

        componentWillMount() {
            //this.setState(this.props);
        }

        render() {
            return _createElement(this.props.children);
        }
    }


    function _render (node, parent) {
        var  children = node.app;
        //let {app:children, ...props} = node;
        
        var ui = [App, null, children && children.__jst && children.default ? children.default : children];
        if (node.designer)
            ui = [(window.parent === null || window === window.parent) ? node.designer : require('@appfibre/jst/intercept.js').default, node ? { file: node.app ? node.app.__jst : null } : {}, ui];
        
        if (node.app != null && node.app.then)
            node.app.then(output => {render(_createElement.call(this, output), parent)});
        else
            render(_createElement.call(this, ui), parent);
    }
    
    var target = app.target || document.body;
    if (target === document.body) {
        target = document.getElementById("main") || document.body.appendChild(document.createElement("div"));
        if (!target.id) target.setAttribute("id", "main");
    }
    document.title = app.title;

    if (module && module.hot) module.hot.accept();
    _render(app, target);

}
export { renderApp };