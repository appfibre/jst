import {app, Context} from '@appfibre/jst';

var fr = new FileReader();
var context = new Context({"async":"false"});

function transform() {
    var rows = source.value.substring(0, source.selectionStart).split('\n');
    divStatus.innerText = "Row: " + rows.length + " Col: " + rows[rows.length-1].length + " Position: " + source.selectionStart + " " + (source.selectionEnd>source.selectionStart?"Selection Length: " + source.selectionEnd-source.selectionStart + "":"");

    try {
        context.transformAsync(JSON.parse(source.value), { indent: 4}, function(result) {
            divTransform.innerText = result
            output.innerText = "No errors";
            output.style.color = "black";
                context.run(result).then(function (code) {
                    preview.innerText =  JSON.stringify(code, function(key, value) {return typeof value === "function" && value.name ? '{'+value.name+'}' : value}, 4);
                    preview.style.color = "black";
                }, function(reason) {
                    preview.innerText = reason;
                    preview.style.color = "red";
                });

            }, function(error) {
            preview.innerText = error;
            preview.style.color = "red";
        });        
    }
    catch (e) {
        preview.innerText = e;
        preview.style.color = "red";
    }
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
        fr.addEventListener('loadend', function(){source.value = fr.result});
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
    if (document.readyState == "complete")  {
        source.addEventListener('keyup', transform);
        btnFormat.addEventListener('click', function() {source.value = formatSource(source.value)});
        fileinput.addEventListener('input', onFileLoad);
        savefile.addEventListener('click', save);
        load('./assets/default.json');        
    }
}