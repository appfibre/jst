"use strict";

exports.default = function (_ref) {
  var t = _ref.types;
  var options = null;
  var name = null;

  return {
  visitor: {
    ObjectProperty(path, state) {
      const visitor = {   
        TemplateLiteral(path) {
            if (t.isArrayExpression(path.parentPath) && path.key === 0 && path.parentPath.container) 
            {
              var elements = path.parentPath.node.elements.slice();
              elements[0] = t.callExpression(t.identifier("__e"), [ t.identifier("this"), t.objectExpression([t.objectProperty(t.stringLiteral("parent"), t.identifier("this"))])]);
              path.parentPath.replaceWith(t.callExpression(t.memberExpression(t.functionExpression(null, [], t.blockStatement([ t.expressionStatement(t.assignmentExpression('=', t.MemberExpression(t.identifier("this"), t.stringLiteral("arguments"), true), t.identifier("[...arguments]")))
                                                                                                                              , t.returnStatement(path.node)])), t.identifier('call')), elements));
            } else if (t.isArrayExpression(path.parentPath) && path.container) {
              path.replaceWith(t.callExpression(t.memberExpression(t.functionExpression(null, [], t.blockStatement([ t.returnStatement(path.node)])), t.identifier('apply')), [ t.identifier("this"), t.memberExpression(t.identifier("this"), t.identifier("arguments"))]));
              }
        },
        ObjectProperty(path) {

          var commented = false;
          if (t.isStringLiteral(path.node.key) && path.node.key.value.startsWith(".")) {
            var cmd = path.node.key.value.substring(1);
            //console.log(cmd);
            var expr;
            if (cmd.startsWith(".")) 
              commented = true;
            else if (cmd == "")
              expr = options.parse["id"].parse.call(this, _ref, path, name);
            else if (options && options.parse && options.parse[cmd] && options.parse[cmd].parse)
              expr = options.parse[cmd].parse.call(this, _ref, path, name);
            else
              console.warn ("command not recognized: " + path.node.key.value);

            if (expr) {
              if (path.parentPath.container) {
                path.parentPath.replaceWith(expr);
                path.parentPath.traverse(visitor); // run again on inner function to catch nested properties
              }
              else {
                console.warn("container is falsy: " + path.node.value);
              }
            } else if (commented)
                path.parentPath.replaceWith(t.objectExpression([]));
          } 
        }
      }; 

        if (t.isStringLiteral(path.node.key) && path.node.key.value== "__name" && t.isObjectExpression(path.parent))
          name = path.get('value').node.value;
        else if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent))	  {
          options = state.opts;
          path.get('value').traverse(visitor);
        }
      }  
    }
  }
}

module.exports = exports["default"];