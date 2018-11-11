module.exports = function(input) {
    var babel = require('@babel/core');

    var options = {};
    var name = this._module ? this._module.resource.substring(this.rootContext.length+1) : '';

    while (name.indexOf('\\') > -1)
        name = name.replace('\\', '/');
        
    var json = null;
    try
    {
        var code = input.toLowerCase();
        if (!code.startsWith("//disable json") && !code.startsWith("//ignore json"))
            json = JSON.parse(input);
    }
    catch (e)
    {
        console.warn(`Warning: ${name} is not JSON compliant: ${e.message}`);
    }

    if (json != null) {
        return babel.transform(`export default ${require('@appfibre/jst').transform(json, settings)}`).code;
    } else {

        if (this._module)
        for (var loader in this._module.loaders)
            if (this._module.request.startsWith(this._module.loaders[loader].loader))   
                options = this._module.loaders[loader].options || {};

        if (!options.parse) options.parse = {};
        if (!options.parse["require"]) options.parse["require"] = require("./parsers/require.js")
        if (!options.parse["call"]) options.parse["call"] = require("./parsers/call.js")
        if (!options.parse["bind"]) options.parse["bind"] = require("./parsers/call.js")
        if (!options.parse["apply"]) options.parse["apply"] = require("./parsers/call.js")
        if (!options.parse["class"]) options.parse["class"] = require("./parsers/class.js")
        if (!options.parse["function"]) options.parse["function"] = require("./parsers/function.js")
        if (!options.parse["new"]) options.parse["new"] = require("./parsers/new.js")
        if (!options.parse["template"]) options.parse["template"] = require("./parsers/template.js")
        if (!options.parse["id"]) options.parse["id"] = require("./parsers/code.js")
        if (!options.parse["scope"]) options.parse["scope"] = require("./parsers/scope.js")
        //if (!options.parse["async"]) options.parse["async"] = require("./parsers/async.js")
        if (!options.parse["app"]) options.parse["app"] = require("./parsers/app.js")

        var settings = { "plugins": [ require("./pre-validation.js")
                                    , require("./options")
                                    , [require("./parse"), options]
                                    //, require("./bind")
                                    , require("./emit") 
                                    //, ["@babel/transform-classes", {"loose":false}]
                                    ]};

        return babel.transform('\r\n export default { "__name": \"' + name.replace('\"', '\\\"') + '\", "__jst": ' + input + '}', settings).code;
    }
};

