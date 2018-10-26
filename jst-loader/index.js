export default function loader (url, parse, base) {

    var baseUrl = base ? base : location.href;
    if (baseUrl.lastIndexOf('/') < baseUrl.length -1)
        baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    var parts = url.split('/');
    
    for (var i = 0; i < parts.length-1; i++)
        if (parts[i] == '..'){
            alert(baseUrl.substring(0, baseUrl.length-1));
            baseUrl = baseUrl.substring(0, baseUrl.length-1).substring(baseUrl.lastIndexOf('/'));
        }
        else if (parts[i] != '.')
            baseUrl = baseUrl + parts[i] + '/';

    if (parts[parts.length-1].indexOf('.') > -1)
        url = parts[parts.length-1];
    else 
        url = '';


    function plugin(input) {
        var Babel = require('babel-standalone');
        var options = {};
        if (!options.parse) options.parse = {};
        if (!options.parse["require"]) options.parse["require"] = require("@appfibre/jst/parsers/require.js")
        if (!options.parse["call"]) options.parse["call"] = require("@appfibre/jst/parsers/call.js")
        if (!options.parse["bind"]) options.parse["bind"] = require("@appfibre/jst/parsers/call.js")
        if (!options.parse["apply"]) options.parse["apply"] = require("@appfibre/jst/parsers/call.js")
        if (!options.parse["class"]) options.parse["class"] = require("@appfibre/jst/parsers/class.js")
        if (!options.parse["function"]) options.parse["function"] = require("@appfibre/jst/parsers/function.js")
        if (!options.parse["new"]) options.parse["new"] = require("@appfibre/jst/parsers/new.js")
        if (!options.parse["template"]) options.parse["template"] = require("@appfibre/jst/parsers/template.js")
        if (!options.parse["id"]) options.parse["id"] = require("@appfibre/jst/parsers/code.js")
        if (!options.parse["scope"]) options.parse["scope"] = require("@appfibre/jst/parsers/scope.js")
    
        var settings = { "plugins": [ require("@appfibre/jst/pre-validation.js")
                                    , require("@appfibre/jst/options")
                                    , [require("@appfibre/jst/parse"), options]
                                    //, require("./bind")
                                    , require("@appfibre/jst/emit") 
                                    ]
                        , "presets": ['es2015','stage-0']};
    
        var name = this && this._module ? this._module.resource.substring(this.rootContext.length+1) : '';
    
        while (name.indexOf('\\') > -1)
            name = name.replace('\\', '/');
            
        try
        {
            var code = input.toLowerCase();
            if (!code.startsWith("//disable json") && !code.startsWith("//ignore json"))
                JSON.parse(input);
        }
        catch (e)
        {
            console.log(`Warning: ${name} is not JSON compliant: ${e.message}`);
        }
        
        var __load = 'var __a = function () { var args = []; for (var arg in arguments) args[arg] = arguments[arg]; for (arg in args) if (args[arg] && args[arg].call) args[arg] = args[arg].call(this ? __e(this, { parent: {parent: this.parent, arguments: this.arguments}, arguments: args }) : null); return args;}; ' 
    + '\r\nvar __e = function(t, u) { for (var p in u) t[p] = u[p]; return t; }; var __c  = {}; var __l = function (o,s,c) { '
    + '\r\n     if (s && __c[s]) return s;'
    //+ '\r\n     if (o.__esModule && o.__jst && o.default) o["__parent"]=c;'
    + '\r\n     if (o.__esModule && o.default) o = o.default;'
    + '\r\n     return s ? __c[s] = o : o;'
    + '\r\n }'
    + '\r\n export default { "__jst": ' + input + ', "__name": \'' + name.replace('\'', '\\\'') + '\'}';
        return Babel.transform(__load, settings).code;
    };
    

    
    function parse(input) {

        return eval("var exports = {}; var require = (input) => Promise.all([loader(input, true, baseUrl)]);" + plugin(input));
        
        

        /*var Babel = require('babel-standalone');
        Babel.registerPlugin('jst', require('@appfibre/jst'));
        
        try {
             var z = Babel.transform(input, {
              presets: []//['es2015','stage-0']
              , plugins: ['jst']
            }).code;
            //alert(z);
            return eval(z);
          } catch (ex) {
            alert(ex);
          }

        //return eval(input);*/

    }
    
    return new Promise((resolve, reject) => {
        try{
            var rq = new XMLHttpRequest();
            rq.open('get',baseUrl + url, true, null, null);
            rq.onloadend = function () {
                if (rq.status == 200) {
                    resolve(parse ? parse(rq.responseText) : rq.responseText);
                } else
                    reject(rq.responseText);
            };
            rq.send();
        } catch (e) {
            reject(e);
        }
    });
}