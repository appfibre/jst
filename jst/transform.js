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
            return `function ${obj[".function"]?obj[".function"]:""}(${obj["arguments"] ? process(obj["arguments"], false, true) : ""}){ return ${process(obj["return"], true)} }`;
        }, 
        ".app": function (obj, keys) {
            Object.defineProperty(obj, 'app', Object.getOwnPropertyDescriptor(obj, '.app'));
            delete obj['.app'];
            return `require('@appfibre/jst').app( ${process(obj, true)} )`;
        },
        ".require": function (obj, keys) {
            return req(obj[".require"]);
        },
        ".map": function (obj, keys) {
            return `${process(obj[".map"], false, false)}.map((${obj["arguments"]}) => ${process(obj["return"], true, false)})`;
        },
        ".filter": function (obj, keys) {
            console.log(`${process(obj[".filter"], false, false)}.filter((${obj["arguments"]}) => ${process(obj["condition"], true, false)})`);
            return `${process(obj[".filter"], false, false)}.filter((${obj["arguments"]}) => ${process(obj["condition"], true, false)})`;
        },
        ".": function (obj, keys) {
            return obj["."];
        }
    }
    
    function process(obj, esc, et) {
        if (obj === null)
            return "null";
        if (Array.isArray(obj))
            return (et ? "" : "[") + obj.map(e => process(e, esc)) + (et ? "" : "]") ;
        else if (typeof obj === "object") {
            var keys = Object.keys(obj);
            for (var k in keys)
                if (keys[k].startsWith(".")) {
                    if (parsers[keys[k]])
                        return parsers[keys[k]](obj, keys);
                    else 
                        console.error(`Could not locate parser ${keys[k].substr(1)}`)
                }
            return (et ? "" : "{")  + keys.filter(k => !k.startsWith("..")).map(k => "\"" + k + "\": " + process(obj[k], esc)) + (et ? "" : "}") ;
        } 
        return esc ? JSON.stringify(obj) : obj;
    }
    return process(json, true, false);
}
