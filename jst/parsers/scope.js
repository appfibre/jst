module.exports = {
    parse: function (_ref, path) 
    {
        var h = require("./helpers.js").apply(this, arguments);
        var t = h.t;

        const visitor = {      
            ArrayExpression(path) {
              if (t.isSpreadElement(path)) return;
              
              var loopcheck = true;
              var arOuter = [t.identifier ("this")];
              
              if (t.isObjectProperty(path.parentPath) && path.parentPath.node.key.value == "arguments")
                  return;
              

              for (var elem in path.node.elements) {
                var ar = t.isArrayExpression(path.node.elements[elem]);
                
                if (t.isMemberExpression(path.node.elements[elem]) && path.node.elements[elem].object.name == "arguments") loopcheck = loopcheck;
                else if (!t.isSpreadElement(path.node.elements[elem])) loopcheck = false;
                
                arOuter.push( t.isArrayExpression(path.node.elements[elem]) || t.isLiteral(path.node.elements[elem]) || t.isSpreadElement(path.node.elements[elem]) ? path.node.elements[elem] : t.functionExpression(null, [], t.blockStatement( [ t.returnStatement(path.node.elements[elem])])) );
              }
    
              if (arOuter.length > 1 && !loopcheck)
                path.replaceWith( t.isCallExpression(path.parentPath) && path.parentPath.node.callee.object && path.parentPath.node.callee.object.name == "__a" ? t.functionExpression(null, [], t.blockStatement([t.returnStatement(t.callExpression(t.memberExpression(t.identifier("__a"), t.identifier("call")), arOuter))])) : t.callExpression(t.memberExpression(t.identifier("__a"), t.identifier("call")), arOuter));          
            }
          }

        path.traverse(visitor);
        return path.get('value');
    }
}