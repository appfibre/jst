export default class Context {
    constructor(settings) {
        this['cache'] = {};
        this._require = this._require.bind(this);
        this.transform = require('./transform').bind(this);
        this.settings = settings;
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
                    response.then(output => {resolve(output)}, reason => reject(reason));
                else
                    resolve(response);
            } catch(e) {
                reject(e.stack);
            }
        });
    }
    

    load (url, parse) {
        return new Promise((resolve, reject) => {
            var run = this.run.bind(this);
            var transform = this.transform.bind(this);
            try{
                var rq = new XMLHttpRequest();

                rq.open('get',url, true, null, null);
                rq.onloadend = function () {
                    if (rq.status == 200) {
                            if (parse) {
                                var contentType = rq.getResponseHeader("content-type");
                                if (!contentType || contentType.startsWith("application/json") || contentType.startsWith("application/jst") || contentType.startsWith("null;")) 
                                    run(transform(JSON.parse(rq.responseText), { "async" : true})).then(output => resolve(output), reason => reject(reason));
                                else
                                {
                                    try
                                    {
                                        resolve(eval(rq.responseText)); 
                                    }
                                    catch (e)
                                    {
                                        reject(new Error(`Unable to parse response from: ${url}, error: ${e.message}`));
                                    }
                                }
                            }
                            else
                                resolve(rq.responseText);
                    }
                    else 
                        reject(`Could not locate ${(url)}`);
                };
                rq.send();
            } catch (e) {
                reject(e);
            }
        });
    }
}  
