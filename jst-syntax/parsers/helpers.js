module.exports = function helpers (_ref, path, name) {

  let t = _ref.types;

  let cmd = function() {
    return path.node.key.value.substring(1);
  };

  let args = function (node) {
    var props = (node ? node : path.parentPath.node).properties;
    var args = null;
    for (var prop in props)
      if (t.isStringLiteral(props[prop].key) && (props[prop].key.value == "arguments" || props[prop].key.value == "args")) 
        args = t.isArrayExpression(props[prop].value) ? props[prop].value.elements : [props[prop].value];
      else if (t.isIdentifier(props[prop].key) && (props[prop].key.name == "arguments" || props[prop].key.name == "args"))
        args = t.isArrayExpression(props[prop].value) ? props[prop].value.elements : [props[prop].value];
    if (cmd() == "function")
      for(var arg in args)
        if (t.isStringLiteral(args[arg])) 
          args[arg] = t.identifier(args[arg].value);
    return args;
};

function toObj(node) {
  var props = (node ? node : path.parentPath.node).properties;
  var obj = {};
  for (var prop in props) 
      obj[t.isStringLiteral(props[prop].key) ? props[prop].key.value : props[prop].key.name] = props[prop].value;
  
  return obj;
}

let req = function (val, id) {
  var parts = [];
  var expr = null;
  var keywords = ["this", "self", "window", "module", "parent", "alert", "confirm"];
  if (t.isStringLiteral(val)) {
      
    if (id)
      expr = t.identifier(val.value);
    else
    {
      var uri = val.value.split('#');
      var async = uri[0].startsWith('~');
      if (async) uri[0] = uri[0].substring(1);

      
      for (var index = 0; index < uri.length; index++) {
        if (index == 0) 
          expr = keywords.indexOf(uri[index]) > -1 ? t.identifier(uri[index]) : async ? t.identifier("obj") : t.callExpression(t.identifier('require'), [t.stringLiteral(uri[index])]) ;
        else 
          expr = t.memberExpression(expr, t.identifier(uri[index]));
      }
      //var prefix = name.indexOf('/') > -1 ? name.substring(0, name.lastIndexOf('/')+1) : "";
      //expr = t.callExpression(t.identifier("__proxy"), [ keywords.indexOf(uri[0]) > -1 ? t.identifier(uri[0]) : async ? t.identifier("obj") : t.callExpression(t.identifier('require'), [t.stringLiteral(uri[0])]), uri.length > 1 ? t.stringLiteral(uri[1]) : t.identifier("null"), t.stringLiteral(prefix + uri[0])]);
        
      if (async) expr = t.callExpression(t.memberExpression(t.callExpression(t.identifier('import'), [t.stringLiteral('.' + uri[0])]), t.identifier('then')), [t.arrowFunctionExpression([t.identifier('obj')], expr) ]);
    }
  } else if (t.isArrayExpression(val)) {

    for (var index = 0; index < val.elements.length; index++) {
      if (index == 0) 
        expr = t.isStringLiteral(val.elements[index]) ? req(val.elements[index]) : val.elements[index];
      else if (t.isStringLiteral(val.elements[index]))
        expr = t.memberExpression(expr, t.identifier(val.elements[index].value));
    }

  } 
  else if (t.isObjectExpression(val))
      expr = val;
  else
      expr = t.callExpression(t.identifier("require"), val);
  return expr;
}

return { req, args, cmd, toObj, t: _ref.types }
}