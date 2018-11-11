module.exports = function (json, settings) {

    if (!settings) settings = {};

    let req = function(val) {
        var expr = null;
        var keywords = ["this", "self", "window", "module", "parent", "alert", "confirm"];
        if (typeof val === "string")  {
            var uri = val.split('#');
            var async = uri[0].startsWith('~');
            if (async) uri[0] = uri[0].substring(1);
            for (var index = 0; index < uri.length; index++) {
                if (index == 0) 
                    expr = keywords.indexOf(uri[index]) > -1 ? uri[index] : async ? "obj" : `(${settings.async?'await ':''}require("${uri[index]}"))`;
                else 
                    expr = `${expr}.${uri[index]}`;
            }
            if (async) expr = `import(${'.'+uri[0]}).then(obj=>${expr})`;
        }
            else console.error(`todo req ${val}`); 
        return expr;
    }

    var parsers = {
        ".function": function (obj, offset) {
            return `function ${obj[".function"]?obj[".function"]:""}(${obj["arguments"] ? process(obj["arguments"], false, true, offset) : ""}){ return ${process(obj["return"], true, false, offset)} }`;
        }, 
        ".app": function (obj, offset) {
            Object.defineProperty(obj, 'app', Object.getOwnPropertyDescriptor(obj, '.app'));
            delete obj['.app'];
            return `require('@appfibre/jst').app( ${process(obj, true, false, offset)} )`;
        },
        ".require": function (obj, offset) {
            return req(obj[".require"]);
        },
        ".map": function (obj, offset) {
            return `${process(obj[".map"], false, false, offset)}.map((${obj["arguments"]}) => ${settings.indent > 0 ? "\r\n" + " ".repeat(offset) :""}${process(obj["return"], true, false, offset)})`;
        },
        ".filter": function (obj, offset) {
            return `${process(obj[".filter"], false, false, offset)}.filter((${obj["arguments"]}) => ${process(obj["condition"], true, false, offset)})`;
        },
        ".": function (obj, offset) {
            return obj["."];
        }
    }
    
    function process(obj, esc, et, offset) {
        if (obj === null)
            return "null";
        if (Array.isArray(obj)) 
        {
            var inner = false;
            obj.forEach(x => inner = (inner || Array.isArray(x) || (x !== null && typeof x === "object" && Object.keys(x).length > 0)));
            return (et ? "" : "[") + obj.map((e, i) => (settings.indent > 0?" ":"") + process(e, esc, false, offset+2) + ((i<obj.length && settings.indent > 0 && inner ? "\r\n" + " ".repeat(offset) :"" ))).join(",") + (et ? "" : "]") ;
        }
        else if (typeof obj === "object") {
            var keys = Object.keys(obj);
            for (var k in keys)
                if (keys[k].startsWith(".")) {
                    if (parsers[keys[k]])
                        return parsers[keys[k]](obj, offset);
                    else 
                        console.error(`Could not locate parser ${keys[k].substr(1)}`)
                }
            
            var inner = false;
            keys.forEach(x => inner = (inner || Array.isArray(obj[x]) || (obj[x] !== null && typeof obj[x] === "object" && Object.keys(obj[x]).length > 0)));           
            return (et ? "" : "{") + keys.filter(k => !k.startsWith("..")).map((k,i) => (settings.indent > 0?" ":"") +  "\"" + k + "\": " + process(obj[k], esc, false, offset) + ((i<keys.length && settings.indent > 0 && inner ? "\r\n" + " ".repeat(offset) :"" ))).join(",") + (et ? "" : "}") ;
        } else if (typeof obj === "function") // object not JSON...
            return obj.toString();

        return esc ? JSON.stringify(obj) : obj;
    }
    return process(json, true, false, 0);
}