module.exports = function (json) {

    let req = function(val) {
        var expr = null;
        var keywords = ["this", "self", "window", "module", "parent", "alert", "confirm"];
        if (typeof val === "string")  {
            var uri = val.split('#');
            var async = uri[0].startsWith('~');
            if (async) uri[0] = uri[0].substring(1);
            for (var index = 0; index < uri.length; index++) {
                if (index == 0) 
                    expr = keywords.indexOf(uri[index]) > -1 ? uri[index] : async ? "obj" : `require("${uri[index]}")`;
                else 
                    expr = `${expr}.${uri[index]}`;
            }
            if (async) expr = `import(${'.'+uri[0]}).then(obj=>${expr})`;
        }
            else console.error(`todo req ${val}`); 
        return expr;
    }

    var parsers = {
        ".function": function (obj, keys) {
            return `function ${obj[".function"]?obj[".function"]:""}(${obj["arguments"] ? process(obj["arguments"], true) : ""}){ return ${process(obj["return"])} }`;
        }, 
        ".app": function (obj, keys) {
            Object.defineProperty(obj, 'app', Object.getOwnPropertyDescriptor(obj, '.app'));
            delete obj['.app'];
            return `require('@appfibre/jst').app( ${process(obj)} )`;
        },
        ".require": function (obj, keys) {
            return req(obj[".require"]);
        }
    }
    
    function process(obj, et) {
        if (obj === null)
            return obj;
        if (Array.isArray(obj))
            return (et ? "" : "[") + obj.map(e => process(e)) + (et ? "" : "]") ;
        else if (typeof obj === "object") {
            var keys = Object.keys(obj);
            for (var k in keys)
                if (keys[k].startsWith(".") && parsers[keys[k]])
                        return parsers[keys[k]](obj, keys);
            return (et ? "" : "{")  + keys.filter(k => !k.startsWith("..")).map(k => "\"" + k + "\": " + process(obj[k])) + (et ? "" : "}") ;
        } 
        return JSON.stringify(obj);
    }
    return process(json, false);
}
