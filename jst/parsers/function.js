module.exports =  {
    parse: function (_ref, path) {
        var h = require("./helpers").apply(this, arguments);
        var obj = h.toObj(path.parentPath.node);

        if (obj["debug"]) 
            return h.t.functionExpression( obj[".function"] && h.t.isStringLiteral(obj[".function"]) ? h.t.identifier(obj[".function"].value) : null, h.args() || [], h.t.blockStatement([h.t.expressionStatement(h.t.identifier("debugger")), h.t.returnStatement(obj["return"] || h.t.identifier(null))], []) );
        else 
            return h.t.functionExpression( obj[".function"] && h.t.isStringLiteral(obj[".function"]) ? h.t.identifier(obj[".function"].value) : null, h.args() || [], h.t.blockStatement([h.t.returnStatement(obj["return"] || h.t.identifier(null))], []) );        

    }
}