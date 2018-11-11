function Inject (app, Context, Resolve, Proxy, JstContext) {
    var Component = Proxy || app.ui.Component;
    class Loader extends Component {
        load() {
            JstContext.load(this.state.url, true).then(obj => {this.setState({children: obj})}, err => {this.setState({children: ["Exception", err]})});
        }

        componentWillMount()
        {
            this.componentWillUpdate({}, this.props);
        }

        componentWillUpdate(props, nextprops) 
        {
            this.checkurl(nextprops);
        }
        
        shouldComponentUpdate(props) {
            return this.checkurl(props);
        }

        checkurl(props) {
            var url = typeof props.url === "function" ? props.url() : props.url;
            if (!this.state || this.state.url !== url)
                this.setState({children: this.props.children, url: url}, this.load);
            return !this.state || this.state.url === url;
        }

        render () {
            return super.render(this.checkurl(this.props) && this.state.children && this.state.children.length > 0 ? this.state.children : this.props.children);
        }
    }

    /*let { title, designer, ui, target, ...inject } = app;
    return { Component 
        , Context 
        , Loader
        , components : app.components
        , ...inject
    };*/

    var inj = {
          Component 
        , Context 
        , Loader
        , Resolve
        , State: Context.state
        , components : app.components
    }
    var keys = Object.keys(app);
    for (var i in keys)
        if (keys[i] != "title" && keys[i] != "designer" && keys[i] != "ui" && keys[i] != "target")
            Object.defineProperty(inj, keys[i], Object.getOwnPropertyDescriptor(app, keys[i]));
    return inj;
}

function xhr (url, parse) {
    function parseContent(rq) {
        var contentType = rq.getResponseHeader("content-type");
        if (contentType.startsWith("application/json") || contentType.startsWith("application/jst") || contentType.startsWith("null;")) {
            var output = require('@appfibre/jst').transform(JSON.parse(rq.responseText));
            return eval(`[${output}]`)[0];
        }
        return  eval(rq.responseText);
    } 

    return new Promise((resolve, reject) => {
        try{
            var rq = new XMLHttpRequest();
            rq.open('get',url, true, null, null);
            rq.onloadend = function () {
                if (rq.status == 200) {
                    try
                    {
                        resolve(parse ? parseContent(rq) : rq.responseText);
                    }
                    catch (e)
                    {
                        reject(new Error(`Unable to parse response from: ${url}, error: ${e.message}`));
                    }
                }
                else
                    reject(rq.responseText);
            };
            rq.send();
        } catch (e) {
            reject(e);
        }
    });
}

export { Inject, xhr }