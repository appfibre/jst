import app from '@appfibre/jst'

var fr = new FileReader();

class clientcontext {
    constructor() {
        this['cache'] = {};
        this._require = this._require.bind(this);
        this.run = this.run.bind(this);
    }

    _require (url) {
        return new Promise((resolve,reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('get',url, true, null, null);
            xhr.onloadend = () => {
                if (xhr.status == 200) {
                    this.run(xhr.responseText).then(output => {
                        this.cache[url] = output;
                        resolve(output);
                    }, reason => reject(reason));
                }
                else 
                    reject(xhr.responseText);
            };
            xhr.send();
        });
    }

    run(str){
        function require(url) {
            return this._require(url);
        }
    
        return new Promise((resolve, reject) => {
            require = require.bind(this);
            try {
                var response = eval(`(async function run() {return ${str}})()`);
                if (response.then)
                    response.then(output => {debugger; return resolve(output)}, reason => reject(reason));
                else
                    resolve(response);
            } catch(e) {
                reject(e.stack);
            }
        });
    }
}

var context = new clientcontext();
function transform() {
    var rows = source.value.substring(0, source.selectionStart).split('\n');
    divStatus.innerText = `Row: ${rows.length} Col: ${rows[rows.length-1].length} Position:${source.selectionStart} ${source.selectionEnd>source.selectionStart?`Selection Length: ${source.selectionEnd-source.selectionStart}`:""}`;

    try {
        divTransform.innerText = app.transform(JSON.parse(source.value), 4);
        output.innerText = "No errors";
        output.style.color = "black";

        context.run(divTransform.innerText).then(output => {
            preview.innerText =  process(output, true, false,0);
            preview.style.color = "black";
        }, reason => {
            preview.innerText = reason;
            preview.style.color = "red";
        });
        
    }
    catch (e) {
        preview.innerText = e;
        preview.style.color = "red";
    }
}

var indent = 4;
function process(obj, esc, et, offset) {
    if (obj === null)
        return "null";
    if (Array.isArray(obj)) {
        var inner = false;
        obj.forEach(x => inner = (inner || Array.isArray(x) || (x !== null && typeof x === "object" && Object.keys(x).length > 0)));
        return (et ? "" : "[") + obj.map((e, i) => (indent > 0?" ":"") + process(e, esc, false, offset+2) + ((i<obj.length && indent > 0 && inner ? "\r\n" + " ".repeat(offset) :"" ))).join(",") + (et ? "" : "]") ;
    }
    else if (typeof obj === "object") {
        var inner = false;
        var keys = Object.keys(obj);
        keys.forEach(x => inner = (inner || Array.isArray(obj[x]) || (obj[x] !== null && typeof obj[x] === "object" && Object.keys(obj[x]).length > 0)));
        return (et ? "" : "{") + keys.map((k,i) => (indent > 0?" ":"") +  "\"" + k + "\": " + process(obj[k], esc, false, offset) + ((i<keys.length && indent > 0 && inner ? "\r\n" + " ".repeat(offset) :"" ))).join(",") + (et ? "" : "}") ;
    } else if (typeof obj === "function")
        return obj.toString();
    return esc ? JSON.stringify(obj) : obj;
}

function formatSource(text) {
    try {
        output.innerText = "";
        output.style.color = "black";

        return process(JSON.parse(text), true, false, 0);
    }
    catch (e) {
        output.innerText = e;
        output.style.color = "red";
    }
}

function onFileLoad() {
    if (fileinput.files.length == 1) {
        fr.addEventListener('loadend', () => source.value = fr.result);
        fr.readAsText(fileinput.files[0].slice(), "application/json");
    }    
}

function save() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'  + encodeURIComponent(source.value));
    element.setAttribute('download', fileinput.files.length == 1 ? fileinput.files[0].name : "file.json" )
    element.innerText = 'download';
    //  element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    //document.body.removeChild(element);
}

function load(url) {
    try{
        var xhr = new XMLHttpRequest();
        xhr.open('get','./default.json', true, null, null);
        xhr.onloadend = function () {
            if (xhr.status == 200) {
                try
                {
                    source.value = xhr.responseText;
                    transform();
                }
                catch (e)
                {
                    output.innerText = e;
                    output.style.color = 'red';
                }
            }
            else {
                output.innerHTML = xhr.responseText;
                output.style.color = 'red';
            }
                
        };
        xhr.send();
    } catch (e) {
        reject(e);
    }
}

document.onreadystatechange = function() {
    /*var z = require('./test.js').default;
    z().then( out =>
    divTransform.innerText = formatSource(JSON.stringify(out, 0, 4)));

    return;*/
    if (document.readyState == "complete")  {
        source.addEventListener('keyup', transform);
        btnFormat.addEventListener('click', () => source.value = formatSource(source.value));
        fileinput.addEventListener('input', onFileLoad);
        savefile.addEventListener('click', save);
        load('./assets/default.json');        
    }
}