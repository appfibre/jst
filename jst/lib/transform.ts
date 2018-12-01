import {ITransformSettings, IParseSettings} from './types'

let req = function(val:any, parseSettings:IParseSettings, reqasync?:boolean) : string {
    var expr = '';
    var keywords = ["this", "self", "window", "module", "parent", "alert", "confirm"];
    if (typeof val === "string")  {
        var uri = val.split('#');
        var async = uri[0].length > 1 && uri[0].charAt(0) == '~';
        if (async) uri[0] = uri[0].substring(1);
        for (var index = 0; index < uri.length; index++) {
            if (index == 0) 
                expr = keywords.indexOf(uri[index]) > -1 ? uri[index] : async ? "obj" : `(${reqasync?'await ':''}require("${uri[index]}"))`;
            else 
                expr = `${expr}.${uri[index]}`;
        }
        if (async) expr = `import(${'.'+uri[0]}).then(function(obj){return ${expr}})`;
    }
        else console.error(`todo req ${val}`); 
    return expr;
}

let imp = function(val:string, parseSettings:IParseSettings) : string
{
    var expr = '';
    var uri = val.split('#');
    var async = uri[0].length > 1 && uri[0].charAt(0) == '~';
    if (async) uri[0] = uri[0].substring(1);
    for (var index = 0; index < uri.length; index++) {
        if (index == 0) {
            if (parseSettings.imports.indexOf(uri[index]) == -1)
                parseSettings.imports.push(uri[index]);
            expr = `imports[${parseSettings.imports.indexOf(uri[index])}]`;
        }
        else 
            expr = `${expr}.${uri[index]}`;
    }
    return expr;
}

function process(obj:any, esc:boolean, et:boolean, parseSettings:IParseSettings, offset?:number) : string {
    if (obj === null)
        return "null";
    if (Array.isArray(obj)) 
    {
        var inner = false;
        obj.forEach(x => inner = (inner || Array.isArray(x) || (x !== null && typeof x === "object" && Object.keys(x).length > 0)));
        return (et ? "" : "[") + obj.map((e, i) => (parseSettings && parseSettings.indent?" ":"") + process(e, esc, false, parseSettings, (offset||0)+2) + ((i<obj.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') :"" ))).join(",") + (et ? "" : "]") ;
    }
    else if (typeof obj === "object") {
        var keys = Object.keys(obj);
        for (var k in keys)
            if (keys[k].length > 0 && keys[k].charAt(0) == '.') {
                if (parseSettings.parsers[keys[k]])
                    return parseSettings.parsers[keys[k]](obj, offset) || '';
                else 
                    console.error(`Could not locate parser ${keys[k].substr(1)}`)
            }
        
        var inner = false;
        keys.forEach(x => inner = (inner || Array.isArray(obj[x]) || (obj[x] !== null && typeof obj[x] === "object" && Object.keys(obj[x]).length > 0)));           
        return (et ? "" : "{") + keys.filter(k => k.length < 2 || k.substr(0, 2) != '..').map((k,i) => (parseSettings.indent?" ":"") +  "\"" + k + "\": " + process(obj[k], esc, false, parseSettings, offset) + ((i<keys.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') :"" ))).join(",") + (et ? "" : "}") ;
    } else if (typeof obj === "function") // object not JSON...
        return obj.toString();        
        
    return typeof obj === "string" && esc ? JSON.stringify(obj) : obj;
}

function initializeSettings(settings:ITransformSettings) : IParseSettings {
    let parseSettings:IParseSettings = { parsers: {}, indent: settings.indent ? 4 : 0, imports: [] };
    
    parseSettings.parsers[".function"] = function (obj:any, offset?:number) : any { return `function ${obj[".function"]?obj[".function"]:""}(${obj["arguments"] ? process(obj["arguments"], false, true, parseSettings, offset) : ""}){ return ${process(obj["return"], true, false, parseSettings, offset)} }`;};
    parseSettings.parsers[".app"] = function (obj:any, offset?:number) : any {
        var obj2:{[key:string]:any} = {};
        var keys = Object.keys(obj);
        for (var key in keys) obj2[keys[key] == ".app" ? "app" : keys[key]] = obj[keys[key]];
        return `require('@appfibre/jst').app( ${process(obj2, true, false, parseSettings, offset)} )`;
    };
    parseSettings.parsers[".map"] = function (obj:any, offset?:number) : any { return `${process(obj[".map"], false, false, parseSettings, offset)}.map(function(${obj["arguments"]}) {return ${settings && settings.indent ? new Array(offset).join(' ') :""}${process(obj["return"], true, false, parseSettings, offset)} })` };
    parseSettings.parsers[".filter"] = function (obj:any, offset?:number) : any { return `${process(obj[".filter"], false, false, parseSettings, offset)}.filter(function(${obj["arguments"]}) {return ${process(obj["condition"], true, false, parseSettings, offset)} })` };
    parseSettings.parsers[".require"] = function (obj:any, offset?:number) : any { return req(obj[".require"], parseSettings, settings && settings.async) + (obj["arguments"] ? `(${process(obj["arguments"], true, true, parseSettings, offset)})` : '') };
    parseSettings.parsers[".import"] = function (obj:any, offset?:number) : any { return imp(obj[".import"], parseSettings); };
    parseSettings.parsers[".call"] = function (obj:any, offset?:number) : any { return `${obj[".call"]}.call(${obj["arguments"] ? process(obj["arguments"], false, true, parseSettings, offset) : ""})` }
    parseSettings.parsers["."] = function (obj:any, offset?:number) : any { return obj["."]; };

    return parseSettings;
}

/*
function chain (obj:any, settings:IParseSettings, resolve:Function, reject:Function) {
    if (obj && !obj.then)
        obj = process(obj, true, false, settings, 0);

    if (Array.isArray(obj)){
        let ar : any[] = [];
        obj.reduceRight(function(prev, cur) { 
            function r (v:any) { chain(v, settings, function (q:any) { ar[ar.length] = q; prev(ar); }, reject) }
            return function() { (cur && cur.then) ? cur.then(r, reject) : r(cur); }
        }, resolve)();
    } else if (obj != null && typeof obj === "object") {
        let o : {[key: string]:any} = {};
        Object.keys(obj).reduceRight(function(prev, cur) { 
            function r (v:any) { chain(v, settings, function(q:any) {o[cur] = q; prev(o); }, reject)} 
            return function() { (obj[cur].then) ? obj[cur].then(r, reject) : r(obj[cur]); }
        }, resolve)();
    }
    else if (obj && obj.then)
        obj.then(function (v:any) {resolve(process(v, true, false, settings, 0))}, reject);
    else 
        resolve(process(obj, true, false, settings, 0));   
}*/

function processAsync(obj:any, esc:boolean, et:boolean, parseSettings:IParseSettings, offset:number, resolve:Function, reject:Function) : void {
    if (obj === null)
        resolve("null");
    if (Array.isArray(obj)) 
    {
        var inner = false;
        obj.forEach(x => inner = (inner || Array.isArray(x) || (x !== null && typeof x === "object" && Object.keys(x).length > 0)));
        resolve ((et ? "" : "[") + obj.map((e, i) => (parseSettings && parseSettings.indent?" ":"") + process(e, esc, false, parseSettings, (offset||0)+2) + ((i<obj.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') :"" ))).join(",") + (et ? "" : "]") );
    }
    else if (typeof obj === "object") {
        var keys = Object.keys(obj);
        for (var k in keys)
            if (keys[k].length > 0 && keys[k].charAt(0) == '.') {
                if (parseSettings.parsers[keys[k]]){
                    var output = parseSettings.parsers[keys[k]](obj, offset, resolve, reject);
                    if (output) resolve(output);
                }
                else 
                    reject (`Could not locate parser ${keys[k].substr(1)}`);
                return;
            }
        
        var inner = false;
        keys.forEach(x => inner = (inner || Array.isArray(obj[x]) || (obj[x] !== null && typeof obj[x] === "object" && Object.keys(obj[x]).length > 0)));           
        resolve ((et ? "" : "{") + keys.filter(k => k.length < 2 || k.substr(0, 2) != '..').map((k,i) => (parseSettings.indent?" ":"") +  "\"" + k + "\": " + process(obj[k], esc, false, parseSettings, offset) + ((i<keys.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') :"" ))).join(",") + (et ? "" : "}"));
    } else if (typeof obj === "function") // object not JSON...
        return obj.toString();        
    else
        return typeof obj === "string" && esc ? JSON.stringify(obj) : obj;
}

function wrapWithPromises(val:string, parseSettings:IParseSettings) : string {
    if (parseSettings.imports.length > 0) {
        val = `require (["${parseSettings.imports.join('","')}"]).then(function (imports) { return ${val} }, reject)`;
    }
    return val;
}

export function transformSync (json:object|Array<object>, settings?:ITransformSettings) : string {
    var parseSettings = initializeSettings(settings || {});
    return wrapWithPromises(process(json, true, false, parseSettings, 0), parseSettings);
}

export function transformAsync (json:object|Array<object>, settings:ITransformSettings, resolve:Function, reject:Function) : void {
    var parseSettings = initializeSettings(settings || {});
    return processAsync(json, true, false, parseSettings, 0, (output:string)=>resolve(wrapWithPromises(output, parseSettings)), reject);
}
