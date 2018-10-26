module.exports =  {
    parse: function (_ref, path) {
        var h = require("./helpers").apply(this, arguments);
        var methods = [];

        var obj = h.toObj(path.parentPath.node);
        var constructor = [];
        var constructorParameters = [];
        for (var prop in obj) 
        if (prop == "constructor") {
            if (h.t.isObjectExpression(obj[prop]))
            constructor.push(obj[prop]);
        }
        constructor.reverse();

        for (var prop in obj)
        if (!prop.startsWith('.') && prop != "constructor" && prop != "extends") {
            var handled = false;
            if (h.t.isObjectExpression(obj[prop])) {
                var obj2 = (h.toObj(obj[prop]));
                if (obj2[".function"]) {
                    methods.push(h.t.classMethod("method", h.t.identifier(prop), h.args(obj[prop]) || [], h.t.blockStatement([h.t.returnStatement(obj2["return"] || h.t.identifier(null))])));
                    handled = true;
                }
        
            }

            if (!handled) {
                if (h.t.isFunctionExpression(obj[prop])){
                    methods.push(h.t.classMethod("method", h.t.identifier(prop), obj[prop].params, obj[prop].body));
                    //console.log(obj[prop].body);
                }
                else{
                    constructor.push(h.t.expressionStatement(h.t.assignmentExpression("=", h.t.memberExpression(h.t.identifier("this"), h.t.identifier(prop)), obj[prop])));
                    //console.log(obj[prop].properties[0]);
                }
            }
        }
        if (obj["extends"])
            constructor.push(h.t.expressionStatement(h.t.callExpression(h.t.identifier("super"), [])));
        constructor.reverse();

        if (constructor.length > (obj["extends"] ? 1 : 0))
        methods.push(h.t.classMethod("constructor", h.t.identifier("constructor"), constructorParameters, h.t.blockStatement(constructor, []), false, false));


        return h.t.classExpression(obj[".class"] ? h.t.isStringLiteral(obj[".class"]) ? h.t.identifier(obj[".class"].value) : obj[".class"] : null, obj["extends"]
                                  , h.t.classBody( methods ), obj[".decorators"] || []);

    }
}