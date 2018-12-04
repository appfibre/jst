var Designer = function inject ( {Component}: {Component: any} ): any {

    class Header extends Component {
        constructor() {
            super();
            this.state = {selectedContext: null, source: null};
            this.onMessage = this.onMessage.bind(this);
            this.edit = this.edit.bind(this);
            this.url_change = this.url_change.bind(this);
            this.navigate_click = this.navigate_click.bind(this);
        }

        componentDidMount() {
            this.setState({url: this.props.document});
            window.addEventListener('message', this.onMessage);
        }

        componentWillUnmount() {
            window.removeEventListener('message', this.onMessage);
        }

        url_change(ev: any) {
            this.setState({url: ev.srcElement.value});
        }

        navigate_click() {
            if (this.props.navigateTo)
                this.props.navigateTo(this.state.url);
        }

        render() {
            return super.render(    [ 'div'
                                    , null
                                    , [   [ 'div'
                                          , {}
                                          , [ [ 'input', {type: 'text', 'style': { width: 'calc(100% - 45px)', background: 'transparent'}, value: this.state.url, onChange: this.url_change} ]
                                            , [ 'button', {style: { float: 'right'}, onClick: this.navigate_click}, 'GO' ]
                                            ]
                                          ]
                                        , [ 'label', null, this.state.selectedContext && this.state.selectedContext.control ? this.state.selectedContext.control.file + ' ' + this.state.selectedContext.control.method : '(none)' ]
                                        , this.state.selectedContext && this.state.selectedContext.control && this.state.selectedContext.canEdit ? ['button', {onClick: this.edit}, 'Edit'] : ['span', {}, '------']
                                      ]
                                    ]);
        }

        edit() {
            if (this.state.selectedContext && this.state.selectedContext.control) {

                var xhr = new XMLHttpRequest();
                xhr.open('GET',  this.state.selectedContext.control.file);
                xhr.setRequestHeader('Content-Type', 'application/jst');
                xhr.send();
                var context = this;
                xhr.addEventListener('load', function(this: XMLHttpRequest, e: ProgressEvent) {
                     if (this.status === 200)
                        context.state.source.postMessage({eventType: 'edit', editMode: 'inline', correlationId: context.state.selectedContext.correlationId}, location.href);
                    });
            }
        }

        onMessage(ev: any) {
            if (this.props.document.substr(0, ev.origin.length) === ev.origin && ev.data) {
                switch (ev.data.eventType) {
                    case 'select':
                        if (this.state.selectedContext && this.state.selectedContext.correlationId && ev.source)
                            ev.source.postMessage({eventType: 'deselect', correlationId: this.state.selectedContext.correlationId}, location.href);
                        this.setState({selectedContext: ev.data, source: ev.source});
                    break;
                }
            }
        }

    }

    return class Designer extends Component {
        constructor() {
            super();
            var url = location.href;
            if (url.lastIndexOf('/') > -1)
                url = url.substr(0, url.lastIndexOf('/') + 1);
            this['state'] = {url: url + 'blank.js'};
            this.navigateTo = this.navigateTo.bind(this);
            // this.onMessage = this.onMessage.bind(this);
        }

        componentWillMount() {
            window.onmessage = this.onMessage;
        }

        /* onMessage(ev) {
            if (this.state.document.startsWith(ev.origin) && ev.data )
            {
                switch (ev.data.eventType)
                {

                }
            }
        }  */

        componentWillUnmount() {
            document.body.style.margin = '';
            document.body.style.background = '';
        }

        componentDidMount() {
            document.body.style.margin = '0px';
            document.body.style.background = '#AAA';
        }

        navigateTo(url: string) {
            this.setState({url});
        }

        render () {
            return super.render(
                [ 'div', null
                ,   [   [ 'header'
                        , {'style': {'padding': '2px'}}
                        , [[ Header, {register: this.props.register, document: this.state.url, navigateTo: this.navigateTo}]]
                        ],
                        [ 'section'
                        , {'style': {'display': 'WebkitFlex flex'}}
                        , [
                                // ['nav', {'style': {'WebkitFlex': '2', 'msFlex': '2', 'flex': '1', 'border': '1px outset lightgrey', 'background': '#EEE', 'margin': '2px'}}, ' '],
                                // ['article', {'style': {'WebkitFlex': '2', 'msFlex': '2', 'flex': '3'}}, [['div', {'style': {'padding': '1px', 'margin': '3px', 'background': 'white'}}, [ this.props.children ]]]]
                                [ 'article'
                                , {'style': {'WebkitFlex': '2', 'msFlex': '2', 'flex': '3'}}
                                , [ [ 'div'
                                    , {'style': {'padding': '1px', 'margin': '3px', 'background': 'white'}}
                                    , [ ['iframe', {style: {width: '100%', height: '900px', border: 'none'},  src: 'proxy.html?' + this.state.url  }/*, this.props.children*/ ] ]
                                    ]
                                  ]
                                ]
                            ,   // ['nav', {'style': {'WebkitFlex': '2', 'msFlex': '2', 'flex': '1', 'border': '1px outset lightgrey', 'background': '#EEE', 'margin': '2px'}}, 'Properties']
                            ]
                        ]
                    ]
                ]);
        }
    };
};

export {Designer};