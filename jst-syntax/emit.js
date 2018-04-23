"use strict";

exports.default = function (_ref) {
  var t = _ref.types;
  return {
  visitor: {
    ObjectProperty(path) {
      if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent))	{
          if (t.isObjectExpression(path.node.value)) {
            for (var control in path.node.value.properties)
              path.parent.properties.push(path.node.value.properties[control]);
          } else if (t.isArrayExpression(path.node.value) || t.isCallExpression(path.node.value) || t.isClassExpression(path.node.value)) 
              path.parent.properties.push(t.objectProperty(t.Identifier("default"), path.node.value));
          path.node.value = t.Identifier("true");
        }   
      }
    }
  }
}

module.exports = exports["default"];