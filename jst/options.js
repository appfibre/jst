"use strict";

exports.default = function (_ref) {
  var t = _ref.types;
  return {
  visitor: {
    ObjectProperty(path) {

      if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent) && t.isObjectExpression(path.node.value))	
        for (var property in path.node.value.properties)
            switch ((t.isStringLiteral(path.node.value.properties[property].key) ? path.node.value.properties[property].key.value : path.node.value.properties[property].key.name).toLowerCase())
            {
                case "__debugger":
                    if (path.node.value.properties[property].value.value) 
                        path.getFunctionParent().pushContainer('body', t.identifier("debugger;")); 
                break;
            }

        //console.log('**************');
      } 
    }
  }
}
module.exports = exports["default"];