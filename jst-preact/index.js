import { h as createElement, render, Component } from 'preact';

class wrap_async extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
          value: this.props.value[2],
        };
    }

    componentDidMount() {
        if (this.props.value[3].then)
            this.props.value[3].then(value => this.setState({"value": value ? [value] : null}), err => { if (this.props.value[4]) this.setState({"value": this.props.value[4](err)})});
        else
            Promise.all(this.props.value[3]).then(value => { this.setState({"value":value})}).catch(err => { if (this.props.value[4]) this.setState({"value": this.props.value[4]})});
    }

    render() {
        /*function wrap(child) {
            if (!child) return null;
            
            if (typeof child == "string")
                return [child];
    
            if (child[3])
                return createElement(wrap_async, {value: child});


            return createElement( child[0]
                                , child[1]
                                , Array.isArray(child[2]) ? child[2].map(c => wrap(c)) : child[2]
                                );  
        }
        return wrap([this.props.value[0], this.props.value[1], this.state.value]);*/
        return _createElement([this.props.value[0], this.props.value[1], this.state.value]);
    }
}


function isClass(func) {
    return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
}

function isExtend(func) {
    return func.__proto__.__proto__.__proto__ != null;
}

class surrogateComponent extends Component {
    render() {
        if (!this["base"] && this.props && this.props.children && (isClass(this.props.children[0]) && !isExtend(this.props.children[0]))) 
            this["base"] = new (this.props.children[0])();

        if (this.base) {
            this["base"].props = this.props.children[1];
            this["base"].children = this.props.children[2];
            return _createElement(this["base"].render())
            //return _createElement(this["base"].render.call({props: this.props.children[1], arguments}))
        }

        else if (Array.isArray(this.props.children[0])) 
            //return createElement(surrogateComponent, {child: this.props.children[0]})
            return createElement(surrogateComponent, null, this.props.children[0])
        else if (typeof this.props.children[0] === 'function')
            return _createElement(this.props.children[0].call({props: this.props.children[1], arguments}));
        else
            return _createElement(this.props.children);
    }
}


 
function _createElement (obj) {
    function wrap(child, key) {
        if (!child) return null;
        
        if (typeof child == "string")
            return [child, key ? {"key": key} : null];

        if (child[3]) 
            return createElement(wrap_async, {value: child, key: key});

        if (child[2] && Array.isArray(child[2]) && child[2].length > 0 && !Array.isArray(child[2][0]))
            throw new Error("Child argument (3) expected to be a double array " + JSON.stringify(child));

        if (typeof child === 'function')
            return createElement.call(this, surrogateComponent, key ? {"key": key} : null, [child]);
        else if (Array.isArray(child[0]) || typeof child[0] === 'function')
            return createElement.call(this, surrogateComponent, key ? {"key": key} : null, child);
        else {
            if (Array.isArray(child[2]))
                for (var c in child[2]) 
                    if (typeof child[2][c] != "string")
                        child[2][c] = wrap(child[2][c], c);
            
            if (key && !child[1]) child[1] = {};
            if (key && !child[1].key) child[1]["key"] = key;
            return createElement( child[0]
                                , child[1]
                                , child[2]
                                );
        }
    }
    return wrap(obj);
}

function _render (node, parent) {
    if (node != null && node.then)
        node.then(output => {render(_createElement(output), parent)});
    else// if (Array.isArray(node))
        render(_createElement.call(this, node), parent);
    /*else
        render(_createElement(node), parent);*/
}

export { _createElement as h, _render as render };