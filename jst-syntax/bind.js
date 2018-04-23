"use strict";

exports.default = function (_ref) {
  var t = _ref.types;
  return {
  visitor: {
    ObjectProperty(path) {
      let index = 0;
      let skipNext = false;
      const visitor = {   
        NewExpression(path) {
          if (skipNext)
            skipNext = false;
          else if (t.isStringLiteral(path.node.callee) && path.node.callee.extra && path.node.callee.extra.raw && path.node.callee.extra.raw.startsWith('\'') && path.node.callee.extra.raw.endsWith('\'')){
            // (self[++index] = self[index] || require('...'))
            path.replaceWith(t.assignmentExpression('=', t.memberExpression(t.memberExpression(t.memberExpression(t.identifier('module'), t.identifier("exports"), false), t.identifier("__cache"), false), t.numericLiteral(++index), true)
                            , t.logicalExpression('||', t.memberExpression(t.memberExpression(t.memberExpression(t.identifier('module'), t.identifier("exports"), false), t.identifier("__cache"), false), t.numericLiteral(index), true),  t.newExpression(path.node.callee, path.node.arguments))));
            skipNext = true;
          }

        },
        StringLiteral(path) {   
          if (path.node.extra && path.node.extra.raw && path.node.extra.raw.startsWith('\'') && path.node.extra.raw.endsWith('\''))
          {
            var url = path.node.value;
            var suffix = url.lastIndexOf('#') > -1 ? url.substring(url.lastIndexOf('#') + 1) : '';
            if (suffix > '')
              url = url.substring(0, url.length - suffix.length - 1);

            if (url.lastIndexOf('#') > -1) {
              var args = url.substring(url.lastIndexOf('#') + 1);
                url = url.substring(0, url.length - args.length - 1);

              path.replaceWith(  t.arrowFunctionExpression([], ( t.memberExpression(  t.assignmentExpression('=', t.memberExpression(t.memberExpression(t.memberExpression(t.identifier('module'), t.identifier("exports"), false), t.identifier("__cache"), false), t.numericLiteral(++index), true)
                                                                                      , t.logicalExpression('||', t.memberExpression(t.memberExpression(t.memberExpression(t.identifier('module'), t.identifier("exports"), false), t.identifier("__cache"), false), t.numericLiteral(index), true) 
                                                                                                          , t.newExpression(t.logicalExpression("||"
                                                                                                                          , t.memberExpression(t.callExpression(t.identifier("require"), [t.stringLiteral(url)]), t.identifier('default'))
                                                                                                                          , t.callExpression(t.identifier("require"), [t.stringLiteral(url)]))
                                                                                  , args > '' ? require('babylon').parse('[' + args + ']').program.body[0].expression.elements : [t.Identifier('self')]))
                                                              ), t.identifier(suffix), false) ) ) );


              
            }
            else if (suffix.length == 0)
              //(require(\"' + url + '\").default'  || require(\"' + url + '\"))';
              path.replaceWith( t.logicalExpression("||", t.memberExpression(t.callExpression(t.identifier("require"), [t.stringLiteral(url)]), t.identifier('default')), t.callExpression(t.identifier("require"), [t.stringLiteral(url)])));
            else 
              //require(\"' + url + '\")' + suffix;
              path.replaceWith(t.memberExpression(t.callExpression(t.identifier("require"), [t.stringLiteral(url)]), t.identifier(suffix), false));
          }
        } 
      }; 

      if (t.isStringLiteral(path.node.key) && path.node.key.value== "__jst" && t.isObjectExpression(path.parent))	
        path.get('value').traverse(visitor);
        
      } 
    }
  }
}

module.exports = exports["default"];