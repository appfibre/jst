"use strict";

exports.default = function (_ref) {
  var t = _ref.types;
  var jst = false;
  var name = null;

  function extractCode(code, loc) {
    var lines = code.split('\n');
    if (loc.start.line == loc.end.line)
      return(lines[loc.start.line-1].substring(loc.start.column, loc.end.column));
  }

  return {
  visitor: {
    ObjectProperty(path) {

      const visitor = {   
        FunctionExpression(path) {
          //console.log(`${name} ${path.node.loc.start.line}:${path.node.loc.start.column} Function expression is not JSON compliant`);
        },
        MemberExpression(path) {
          //console.log(`${name} ${path.node.loc.start.line}:${path.node.loc.start.column} Member expression "${extractCode(path.hub.file.code, path.node.loc)}" is not JSON compliant`);
        } 

      }
      if (t.isStringLiteral(path.node.key) && path.node.key.value== "__name")	
        name = path.node.value.value;
      else if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent))	
          path.get('value').traverse(visitor);

        
      },
      
      
    }
  }
}
module.exports = exports["default"];