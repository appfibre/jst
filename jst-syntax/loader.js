module.exports = function(input, settings) {
    var babel = require('babel-core');
    var settings = settings || { };
    if (!settings.plugins)
        settings.plugins = [];
        
    if (settings.plugins.indexOf('jst-syntax/bind') < 0)
        settings.plugins.push('jst-syntax/bind');
    if (settings.plugins.indexOf('jst-syntax/emit') < 0)
        settings.plugins.push('jst-syntax/emit');    
    
    //console.log('Plugins: ' + JSON.stringify(settings.plugins)); 
    return babel.transform('module.exports = { "__esModule": true, "__cache": [], "__jst": ' + input + '};', settings).code;
};

