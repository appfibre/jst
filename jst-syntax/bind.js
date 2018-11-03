"use strict";

exports.default = function (_ref) {
  var t = _ref.types;
  return {
  visitor: {
    ObjectProperty(outerpath) {
      const visitor = {      
        ArrayExpression(path) {
          if (t.isSpreadElement(path)) return;
          
          var loopcheck = true;
          //var arOuter = [t.objectExpression( [t.objectProperty(t.stringLiteral("parent"), t.identifier("this"))])];
          var arOuter = [t.identifier ("this")];
          var arInner = [];
          var fn = false;
          for (var elem in path.node.elements) {
            //arOuter.push( t.isArrayExpression(path.node.elements[elem]) ? t.callExpression(t.memberExpression(t.functionExpression(null, [], t.blockStatement( [ t.returnStatement(path.node.elements[elem])])), t.identifier("call")), [t.identifier("this")]) : path.node.elements[elem] );
            var ar = t.isArrayExpression(path.node.elements[elem]);
            //if (arInner.length == 0 && t.isFunctionExpression(path.node.elements[elem])) fn = path.node.elements[elem];
            
            if (t.isMemberExpression(path.node.elements[elem]) && path.node.elements[elem].object.name == "arguments") loopcheck = loopcheck;
            else if (!t.isSpreadElement(path.node.elements[elem])) 
            {
              loopcheck = false;
              //console.log(path.node.elements[elem]);
            }
            
            arOuter.push( t.isArrayExpression(path.node.elements[elem]) || t.isLiteral(path.node.elements[elem]) || t.isSpreadElement(path.node.elements[elem]) ? path.node.elements[elem] : t.functionExpression(null, [], t.blockStatement( [ t.returnStatement(path.node.elements[elem])])) );
            //arInner.push( arInner.length == 0 && fn ? t.identifier("this") : t.memberExpression(t.identifier("arguments"), t.numericLiteral(arInner.length), true) );
            //if (ar)
            //  arInner[arInner.length-1] = t.callExpression(t.memberExpression(arInner[arInner.length-1], t.identifier("call"), false), [t.identifier("this")]);              
          }

          
            

          if (arOuter.length > 1 && !loopcheck)
          path.replaceWith( t.isCallExpression(path.parentPath) && path.parentPath.node.callee.object && path.parentPath.node.callee.object.name == "__a" ? t.functionExpression(null, [], t.blockStatement([t.returnStatement(t.callExpression(t.memberExpression(t.identifier("__a"), t.identifier("call")), arOuter))])) : t.callExpression(t.memberExpression(t.identifier("__a"), t.identifier("call")), arOuter));          
        }
      }
  

      if (t.isStringLiteral(outerpath.node.key) && outerpath.node.key.value== "__jst" && t.isObjectExpression(outerpath.parent))	
        //console.log(path.hub.file.code);
        outerpath.get('value').traverse(visitor);
        //console.log('**************');
      } 
    }
  }
}
module.exports = exports["default"];