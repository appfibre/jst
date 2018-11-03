module.exports = {
    parse: function (_ref, path) 
    {
        var h = require("./helpers.js").apply(this, arguments);
        var args = h.args();
        return args == null ? h.req(path.node.value) : h.t.callExpression(h.req(path.node.value), args); 
    }    
}