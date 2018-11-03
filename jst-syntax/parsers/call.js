module.exports = {
    parse: function (_ref, path, name) 
    {
        var h = require("./helpers.js").apply(this, arguments);
        return h.t.callExpression(h.t.memberExpression(h.req(path.node.value), h.t.identifier(h.cmd())), h.args() || []);
    }
}