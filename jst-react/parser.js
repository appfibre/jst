"use strict";
exports.default = function (_ref) {
  var t = _ref.types;
  return {
  visitor: {
    ObjectProperty(path) {

      const visitor = {   
        ArrayExpression: { enter(path) {   
          var parent = path.getStatementParent();
          if (!t.isCallExpression(path.parent) ) {
              // var _parent = require('react').CreateElement('...')
              var id = parent.scope.generateUidIdentifier("parent"); 
              parent.insertBefore(t.variableDeclaration("var", [t.variableDeclarator(id, t.callExpression(t.memberExpression(t.callExpression(t.Identifier('require'), [t.StringLiteral('react')]), t.Identifier('createElement')), path.node.elements))]));
              path.replaceWith(id);
            }
          }
        }, 
        Identifier: { exit(path) {
          if (t.isIdentifier(path.node, {name: 'self'})) {
            var parent = path.find(n => n.isVariableDeclaration() ); 
            if (t.isVariableDeclaration(parent))
              // replace 'this' with '_parent'
              path.replaceWith(parent.node.declarations[0].id);
          }
        }}
      }; 

      
      /* class '....' extends react.Component {
          render () {
            return [...];
          }
        }
      }
      */
      if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent)) {
        if (t.isObjectExpression(path.node.value)) {
          for (var control in path.node.value.properties)
            path.get('value.properties.' + control + '.value').replaceWith( t.classExpression(t.identifier(path.node.value.properties[control].key.value), t.memberExpression(t.callExpression(t.identifier('require'), [t.stringLiteral('react')]), t.identifier('Component'))
                                                                          , t.classBody([t.classMethod("method", t.identifier('render'), [], t.blockStatement([t.returnStatement(path.node.value.properties[control].value)]))]), []));
        } else if (t.isArrayExpression(path.node.value) ) 
            path.get('value').replaceWith( t.classExpression(t.identifier('_default'), t.memberExpression(t.callExpression(t.identifier('require'), [t.stringLiteral('react')]), t.identifier('Component'))
                                        , t.classBody([t.classMethod("method", t.identifier('render'), [], t.blockStatement([t.returnStatement(path.node.value)]))]), []));
                                        
          path.traverse(visitor);
        }   
      }
    }
  }
}

module.exports = exports["default"];