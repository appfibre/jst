"use strict";

exports.default = function (_ref) {
  var t = _ref.types;
  var name = null;
  return {
  visitor: {
    ObjectProperty(path) {
      if (t.isStringLiteral(path.node.key) && path.node.key.value== "__name" && t.isObjectExpression(path.parent))
          name = path.get('value').node.value;
      else if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent) && t.isExportDefaultDeclaration(path.parentPath.parent))	{
          if (t.isObjectExpression(path.node.value)) {  // export {"a" : "b", ...}
            var vars = [];
            vars.push(t.variableDeclarator(t.identifier("__jst"), t.stringLiteral(name)));
            for (var prop in path.node.value.properties) 
              vars.push(t.variableDeclarator(t.identifier(t.isStringLiteral(path.node.value.properties[prop].key) ? path.node.value.properties[prop].key.value : path.node.value.properties[prop].key.name), path.node.value.properties[prop].value));
            path.parentPath.parentPath.replaceWith(t.exportNamedDeclaration(t.variableDeclaration("var", vars), []));
            
          } else { // export default []
            //path.parentPath.replaceWith(t.callExpression(t.memberExpression(t.callExpression(t.identifier("require"), [t.stringLiteral("@appfibre/jst/intercept.js")]), t.identifier("default")), [path.node.value, t.stringLiteral(name)]));
            path.findParent((path) => path.isProgram()).unshiftContainer('body', t.exportNamedDeclaration(t.variableDeclaration("var", [ t.variableDeclarator(t.identifier("__jst"), t.stringLiteral(name)) ]), []));
            path.parentPath.replaceWith(path.node.value);
          }
        }
        /*else if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent)) {
          path.parentPath.parentPath.replaceWith(t.variableDeclarator(t.identifier("__jst"), t.functionExpression(null, [ t.identifier("__proxy")], t.blockStatement([t.returnStatement(t.isObjectExpression(path.node.value) ? path.node.value : t.objectExpression([ t.objectProperty(t.identifier("default"), path.node.value)]))]))));

          if (t.isObjectExpression(path.node.value))	{
            var vars = [];
              for (var prop in path.node.value.properties) {
                var key = t.isStringLiteral(path.node.value.properties[prop].key) ? path.node.value.properties[prop].key.value : path.node.value.properties[prop].key.name;
                vars.push(t.variableDeclarator(t.identifier(key), t.memberExpression(t.callExpression(t.identifier("__jst"), [t.identifier("__proxy")]), t.stringLiteral(key), true)));
              }
            
            path.getFunctionParent().pushContainer('body', t.exportNamedDeclaration(t.variableDeclaration("var", vars), []));
          }
          else 
            path.getFunctionParent().pushContainer('body', t.exportDefaultDeclaration(t.memberExpression(t.callExpression(t.identifier("__jst"), [t.identifier("__proxy")]), t.identifier("default"))));
        }*/
      }
    }
  }
}
module.exports = exports["default"];