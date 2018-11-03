module.exports = {
    parse: function (_ref, path) 
    {
        var h = require("./helpers.js").apply(this, arguments);
        var args = h.args();
        
        if (h.t.isStringLiteral(path.node.value)) {
            var expr = h.t.templateLiteral([h.t.templateElement({ raw: path.node.value.value})], []);
            if (args != null)
              expr = h.t.callExpression(h.t.memberExpression( h.t.functionExpression(null, [], h.t.blockStatement(  [ h.t.expressionStatement(h.t.assignmentExpression('=', h.t.MemberExpression(h.t.identifier("this"), h.t.stringLiteral("arguments"), true), h.t.identifier("[...arguments]")))
                                                                                        , h.t.returnStatement(expr)])), h.t.identifier("apply")), [h.t.identifier("this"), h.t.arrayExpression(args)]);

            return expr;
        } else
            throw new Error(".tempate requires string expression");
    }
}