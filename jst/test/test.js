'use strict';
var jst = require('../dist/index.js');
const path = require('path');
const fs = require('fs');

var walkSync = function (dir, filter, filelist) {
    var fs =  fs || require('fs');
    var path = path || require('path');
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filter, filelist);
        } else if (!filter || filter.test(file))
            filelist.push(path.join(dir, file));
    });
    return filelist;
}

var getRelativePath = function(p, b) {
    while (p.indexOf('\\') > -1)
        p = p.replace('\\', '/');
    return p.startsWith(b) ? './'+p.substring(b.length) : p;
}


function RunTests(categoryName, basedir, call, inputsuffix, outputsuffix, expectedsuffix){
    var expect = expect || require('chai').expect;

    describe(categoryName, () => {
        walkSync('test/'+basedir, new RegExp('.*'+inputsuffix)).forEach(test => {
            function evaluateTest(output) {
                fs.writeFileSync(p.replace('.' +inputsuffix, '.'+outputsuffix), output);
                var _expected = p.replace('.'+inputsuffix, '.'+expectedsuffix);
                if (fs.existsSync(_expected)) 
                    it(test, () => expect(output).to.equal(fs.readFileSync(_expected, 'utf8')))
                else 
                    console.warn('Cannot evalute test, ' + _expected + ' not found');
            }

            function failTest(reason) {
                it(test, () => fail(reason));
            }

            var p = getRelativePath('./'+test);

            var input = require(getRelativePath('./'+test, './test'));
            var output = call(input, evaluateTest, failTest);
            if (output)
                evaluateTest(output);
        });
    });    
}

RunTests('JST Client Side Tranforms', 'transform', input => jst.transformSync(input), 'input.json', 'output.js', 'expected.js');
RunTests('JST Client Side Tranforms Asynchronous', 'transform', (input, resolve, reject) => jst.transformAsync(input, {}, resolve, reject), 'input.json', 'output_async.js', 'expected.js');


//console.log(jst.transformSync({".app": [ "div", null, "Hello"]}));
//jst.transformAsync({".app": [ "div", null, "Hello"]}, {}, console.log);
//jst.transformAsync([1, new Promise(resolve => resolve(3)), new Promise((resolve, reject) => [1, 2, {".code": "5", "z": new Promise((resolve, reject) => resolve("YES!"))}, 4]),2], {}, console.log);
/*

function chain (obj, resolve, reject) {
    if (Array.isArray(obj)){
        let ar = [];
        obj.reduceRight(function(prev, cur) { 
            function r (v) { chain(v, function (q) { ar.push(q); prev(ar); }, reject) }
            return function() { (cur.then) ? cur.then(r, reject) : r(cur); }
        }, resolve)();
    } else if (typeof obj === "object") {
        let o = Object();
        Object.keys(obj).reduceRight(function(prev, cur) { 
            function r (v) { chain(v, function(q) {o[cur] = q; prev(o); }, reject)} 
            return function() { (obj[cur].then) ? obj[cur].then(r, reject) : r(obj[cur]); }
        }, resolve)();
    }
    else if (obj.then)
        obj.then(function (v) {resolve(jst.transformSync(v))}, reject);
    else
        resolve(jst.transformSync(obj));
}

chain([1, new Promise(resolve => resolve(3)), new Promise((resolve, reject) => chain([1, 2, {".code": "5", "z": new Promise((resolve, reject) => resolve("YES!"))}, 4], resolve, reject)),2], console.log, console.log); 

chain([1, [new Promise((resolve, reject) => resolve(3))], {"a":"b"} ], console.log, console.log); 
*/

