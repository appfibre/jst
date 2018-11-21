import { IContextSettings } from './interfaces/IContextSettings'
import { transformAsync } from './transform';
import { Promise } from './promise';

type ICache = {[key: string]: any}

export class JstContext  {

    private _transform: Function
    private _settings: IContextSettings
    private _cache: ICache

    constructor(settings : IContextSettings) {
        this._cache = Object();
        this._transform = transformAsync.bind(this);
        this._settings = settings;
        this.run = this.run.bind(this);
    }

    _require (url : string) {
        return new Promise<any>((resolve:Function,reject:(reason:any)=>PromiseLike<never>) => {
            var xhr = new XMLHttpRequest();
            xhr.open('get',url, true, null, null);
            xhr.onloadend = () => {
                if (xhr.status == 200) {
                    this.run(xhr.responseText).then(output => {
                        this._cache[url] = output;
                        resolve.call(output);
                        return output;
                    }, reject);       //reason => reject(reason)
                }
                else 
                    reject(xhr.responseText);
            };
            xhr.send();
        });
    }

    run(str:string)  {
        var _req = this._require.bind(this);
        function require(url:string) {
            return _req(url);
        };
    
        return new Promise<any>((resolve:Function,reject:(reason:any)=>PromiseLike<never>) => {
            try {
                var response = eval(`(async function run() {return ${str}})()`);
                if (response.then)
                    response.then(resolve,reject)//.then(output => {resolve(output)}, reason => reject(reason));
                else
                    resolve(response);
            } catch(e) {
                reject(e.stack);
            }
        });
    }
    

    load (url : string, parse : boolean) : Promise<any> {
        return new Promise((resolve:Function, reject:Function) => {
            var run = this.run.bind(this);
            var transform = this._transform.bind(this);
            try {
                var rq = new XMLHttpRequest();
                rq.open('get',url, true, null, null);
                rq.onloadend = function () {
                    if (rq.status == 200) {
                            if (parse) {
                                var contentType = rq.getResponseHeader("content-type");
                                
                                if (!contentType || contentType.substring(0, "application/json".length) == "application/json" || contentType.substring(0, "application/jst".length) == "application/jst" || contentType.substring(0, "null;".length) == "null;") 
                                    transform(JSON.parse(rq.responseText), { "async" : true}, function (output:any) { run(output).then(resolve, reject)}, reject);
                                    //run(transform(JSON.parse(rq.responseText), { "async" : true})).then(resolve, reject); // .then(output => resolve(output), reason => reject(reason));
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
