var parsers = {
    ".function": function (obj, keys) {
        return (`function ${obj[".function"]?obj[".function"]:""}(${obj["arguments"] ? process(obj["arguments"], true) : ""}){ return ${process(obj["return"])} }`);
    }
}

function process(obj, et) {
    if (Array.isArray(obj))
        return (et ? "" : "[") + obj.map(e => process(e)) + (et ? "" : "]") ;
    else if (typeof obj == "object") {
        var keys = Object.keys(obj);

        for (var k in keys)
            if (keys[k].startsWith(".") && parsers[keys[k]])
                    return parsers[keys[k]](obj, keys);

        return (et ? "" : "{")  + keys.map(k => "\"" + k + "\": " + process(obj[k])) + (et ? "" : "}") ;
    } 
    return JSON.stringify(obj);
}
