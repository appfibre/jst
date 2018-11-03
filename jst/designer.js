export default function inject ( {Component} ) {

    class header extends Component {
        constructor() {
            super();
            this.state = {selectedContext: null, source: null};
            this.onMessage = this.onMessage.bind(this);
            this.edit = this.edit.bind(this);
        }

        componentDidMount() {
            window.addEventListener("message", this.onMessage);
        }

        componentWillUnmount() {
            window.removeEventListener("message", this.onMessage);
        }

        render() {
            return super.render(    [ "div"
                                    , null
                                    , [ [ "label", null, this.state.selectedContext && this.state.selectedContext.control? this.state.selectedContext.control.file + ' ' + this.state.selectedContext.control.method : "(none)"]
                                        , this.state.selectedContext && this.state.selectedContext.control && this.state.selectedContext.canEdit ? ["button", {onClick: this.edit}, "Edit"] : ["span", {}, "------"]]]);
        }

        edit() {
            if (this.state.selectedContext && this.state.selectedContext.control) {

                var xhr = new XMLHttpRequest();
                xhr.open('GET',  this.state.selectedContext.control.file);
                xhr.setRequestHeader('Content-Type', 'application/jst');
                xhr.send();
                xhr.addEventListener('load', function(e) {
                    if (e.target.status == 200)
                        this.state.source.postMessage({eventType: "edit", editMode: "inline", correlationId: this.state.selectedContext.correlationId}, location.href);

                    }.bind(this));
            }
        }

        onMessage(ev) {
            if (this.props.document.startsWith(ev.origin) && ev.data )
            {
                switch (ev.data.eventType)
                {
                    case "select":
                        if (this.state.selectedContext && this.state.selectedContext.correlationId)
                            ev.source.postMessage({eventType: "deselect", correlationId: this.state.selectedContext.correlationId}, location.href);
                        this.setState({selectedContext: ev.data, source: ev.source});
                    break;
                }
            }
        }

    }

    return class Designer extends Component
    {
        constructor() 
        {
            super();

            this["state"] = {document: location.href};
            this.onMessage = this.onMessage.bind(this);
        }

        componentWillMount() {
            window.onmessage = this.onMessage;
        }

        onMessage(ev) {
            if (this.state.document.startsWith(ev.origin) && ev.data )
            {
                switch (ev.data.eventType)
                {

                }
            }
        }

        componentWillUnmount() {
            document.body.style.margin = "";
            document.body.style.background = "";
        }

        componentDidMount(){
            document.body.style.margin = "0px";
            document.body.style.background = "#AAA";
        }

        render () {
            return super.render( 
                [ "div", null
                ,   [   [ "header"
                        , {"style": {"padding": "2px"}}
                        , [[ header, {register:this.props.register, document: this.state.document}]]
                        ],
                        [ "section"
                        , {"style": {"display": "WebkitFlex", "display": "flex"}}
                        , [
                                //["nav", {"style": {"WebkitFlex": "2", "msFlex": "2", "flex": "1", "border": "1px outset lightgrey", "background": "#EEE", "margin": "2px"}}, " "],
                                //["article", {"style": {"WebkitFlex": "2", "msFlex": "2", "flex": "3"}}, [["div", {"style": {"padding": "1px", "margin": "3px", "background": "white"}}, [ this.props.children ]]]]
                                [ "article"
                                , {"style": {"WebkitFlex": "2", "msFlex": "2", "flex": "3"}}
                                , [ [ "div"
                                    , {"style": {"padding": "1px", "margin": "3px", "background": "white"}}
                                    , [ ["iframe", {style: {width: "100%", height: "900px", border: "none"}, src: this.state.document}/*, this.props.children*/ ] ]
                                    ]
                                  ]   
                                ]
                            ,   //["nav", {"style": {"WebkitFlex": "2", "msFlex": "2", "flex": "1", "border": "1px outset lightgrey", "background": "#EEE", "margin": "2px"}}, "Properties"]
                            ]
                        ]
                    ]
                ]);
        }
    }
}