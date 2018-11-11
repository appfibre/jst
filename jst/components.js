export default function (app, Context, Resolve, xhr, Proxy) {

    var Component = Proxy || app.ui.Component;

    class Loader extends Component {
        load() {
            xhr(this.state.url, true).then(obj => {this.setState({children: obj})}, err => this.setState({children: ["Exception", err]}));
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