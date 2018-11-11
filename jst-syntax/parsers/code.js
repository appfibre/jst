module.exports =  {
    parse: function (_ref, path) {
        var h = require("./helpers").apply(this, arguments);
        var expr = h.req(path.node.value, h.cmd() == "" );
        var args = h.args();
        if (args != null)
            expr = h.t.callExpression(expr, args)
        return expr;
    }
}