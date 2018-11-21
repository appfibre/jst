import { JstContext } from './JstContext';
import { transformAsync } from './transform';
import { IAppSettings, IContext } from './types';
import { Promise } from './promise';

export function Inject (app : IAppSettings, Context : IContext, Resolve : any, Proxy:any, JstContext:JstContext) : any {
    var Component = Proxy || app.ui.Component;
    class Loader extends Component {
        load() {
            JstContext.load(this.state.url, true).then(obj => {this.setState({children: obj})}, err => {this.setState({children: ["Exception", err]})});
        }

        componentWillMount()
        {
            this.componentWillUpdate({}, this.props);
        }

        componentWillUpdate(props:any, nextprops:any) 
        {
            this.checkurl(nextprops);
        }
        
        shouldComponentUpdate(props:any) {
            return this.checkurl(props);
        }

        checkurl(props:any) {
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
            Object.defineProperty(inj, keys[i], Object.getOwnPropertyDescriptor(app, keys[i])||{});
    return inj;
}

export function xhr (url:string, parse:boolean) : Promise<any> {
    function parseContent(rq:XMLHttpRequest, resolve:Function, reject:Function) {
        var contentType = rq.getResponseHeader("content-type");
        if (contentType && (contentType.substr(0, "application/json".length) == "application/json" || contentType.substr(0, "null;".length) == "null;")) {
            //var output = require('@appfibre/jst').transform(JSON.parse(rq.responseText));
            transformAsync(JSON.parse(rq.responseText), {}, function(output:any) { resolve(eval(`[${output}]`)[0])}, reject);
        }
        return  resolve(eval(rq.responseText));
    } 

    return new Promise<any>((resolve:Function,reject:(reason:any)=>PromiseLike<never>) => {
        try{
            var rq = new XMLHttpRequest();
            rq.open('get',url, true, null, null);
            rq.onloadend = function () {
                if (rq.status == 200) {
                    try
                    {
                        if (parse) resolve(rq.responseText); else parseContent(rq, resolve, reject);
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

