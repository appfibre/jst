module.exports = function(input, settings) {
    var loader = require ('jst-syntax/loader.js')
    var settings = settings || { };
    if (!settings.plugins)
        settings.plugins = [];
    if (settings.plugins.indexOf('jst-syntax/bind') < 0)
        settings.plugins.push('jst-syntax/bind');
    if (settings.plugins.indexOf('jst-react/parser') < 0)
        settings.plugins.push('jst-react/parser');
    return loader(input, settings);
};

