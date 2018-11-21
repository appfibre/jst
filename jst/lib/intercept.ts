var Intercept = function inject ( {Component} : {Component:any} ) {

    return class Intercept extends Component {

        state:{focus:boolean, selected:boolean, editMode:any, canEdit: boolean};
        constructor() 
        {
            super();
            this.state = {focus: false, selected: false, editMode: null, canEdit: true}; 
            this.onMessage = this.onMessage.bind(this);
            this.click = this.click.bind(this);
            this.mouseEnter = this.mouseEnter.bind(this);
            this.mouseLeave = this.mouseLeave.bind(this);
        }

        componentDidMount()
        {
            window.addEventListener("message", this.onMessage);
            window.onclick = function(){ parent.postMessage({eventType: "select", correlationId: Date.now().toString()}, location.href);}
        }

        componentWillUnmount()
        {
            window.removeEventListener("message", this.onMessage);
        }

        reconstruct(obj:any) {
            if (!obj[1]) obj[1] = {};
            if (!obj[1].style) obj[1].style = {}; 
            if (!obj[1].style.border && !obj[1].style.padding && !obj[1].onMouseEnter && !obj[1].onMouseLeave) {
                obj[1].style.padding = this.state.focus || this.state.selected ? "1px" : "2px";
                if (this.state.editMode) obj[1].style.background = "lightblue";
                if (this.state.selected) obj[1].style.border = "1px solid black";
                else if (this.state.focus) obj[1].style.border = "1px dashed grey";
                obj[1].onMouseEnter = this.mouseEnter;
                obj[1].onMouseLeave = this.mouseLeave;
                obj[1].onClick = this.click;
            }
            return obj;
        }

        render() {
            //return super.render(Array.isArray(this.props.children) ? this.reconstruct(["div", {style: {display: "inline-block"}}, this.props.children])  : this.reconstruct(this.props.children));
            return super.render(this.reconstruct(["div", {style: {display: "inline-block"}, key: 0}, this.props.children]));
        }

        mouseEnter() {
            
            //x.Designer.notify("x");
            this.setState({"focus": true})
        }

        mouseLeave() {
            //x.Designer.notify("y");
            this.setState({"focus": false})
        }

        click(ev:any) {
            ev.stopPropagation();
            //Designer.notify(this.props.file);
            var parent = window;
            while (parent.parent !== parent && window.parent != null)
                parent = parent.parent;
            
            
            var correlationId = Date.now().toString();
            parent.postMessage({eventType: "select", editMode: this.state.editMode, canEdit: this.state.canEdit, correlationId, control: {file:this.props.file, method:this.props.method}}, location.href);
            this.setState({"selected": correlationId} );
        }

        onMessage(ev:any) {
            if (location.href.substr(0, ev.origin.length) ==  ev.origin && ev.type == "message" && ev.data )
            {
                if (this.state.selected == ev.data.correlationId)
                switch (ev.data.eventType)
                {
                    case "deselect":
                        this.setState({selected: false});
                    break;
                    case "edit":
                        this.setState({editMode: ev.data.editMode});
                    break;
                }
            }
        }
}
}

export {Intercept};