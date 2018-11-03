module.exports = {
    // {".app": [], "ui": {".require": "jst-preact"}, "target": {".call" : "document.getElementByTagName", args["body"]}, "title": "Title", "editor": {".require": "jst-editor"}, "loading": [...]}
    parse: function (_ref, path, fileName) 
    {
        var h = require("./helpers.js").apply(this, arguments);
        var obj = h.toObj();
        var props = [];
        for (var prop in obj)
            props.push(h.t.objectProperty(h.t.stringLiteral(prop.substr(prop.startsWith(".") ? 1 : 0)), obj[prop]));
        props.push(h.t.objectProperty(h.t.stringLiteral("file"), h.t.stringLiteral(fileName)));

            
        var parent = path.findParent((path) => path.isProgram());
        if (parent) parent.unshiftContainer('body', h.t.ifStatement(h.t.identifier("module.hot"), h.t.expressionStatement( h.t.callExpression(h.t.identifier("module.hot.accept"), [])) )); 

        //return h.t.callExpression(h.t.memberExpression(obj["ui"], h.t.identifier("renderApp")), [ h.t.objectExpression(props) ]);
        
        return h.t.callExpression(h.t.memberExpression(h.t.callExpression(h.t.identifier("require"), [ h.t.stringLiteral("@appfibre/jst/app.js")]), h.t.identifier("renderApp")), [h.t.objectExpression(props)]);
    }    
}
