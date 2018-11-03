module.exports = {
    parse: function (_ref, path) 
    {
        var h = require("./helpers.js").apply(this, arguments);
        return h.t.newExpression(h.req(path.node.value), h.args() || []);
    }
}