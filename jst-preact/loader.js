module.exports = function(input, settings) {
    var loader = require ('jst-syntax/loader.js')
    var settings = settings || { };
    if (!settings.plugins)
        settings.plugins = [];
    if (settings.plugins.indexOf('jst-syntax/bind') < 0)
        settings.plugins.push('jst-syntax/bind');
            
    if (settings.plugins.indexOf('jst-preact/parser') < 0)
        settings.plugins.push('jst-preact/parser');
    return loader(input, settings);
};

