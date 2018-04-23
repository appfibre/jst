var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: ['./index.js']
    , module: { 
        rules: [
            {
                exclude: /node_modules/,
                test: /.js[x]?$/,
                use: [
                    {
                        loader: 'babel-loader', query: { presets: [] }
                    }
                ],
            }, 
            {
                exclude: /node_modules/,
                test: /.jst$/,
                use: [
                    {
                        loader:  'jst-syntax', query: { presets: [] }
                    }
                ]
            },
        ],
    },
    output: {
          filename: 'index_bundle.js'
        , path: __dirname + '/dist'
    },
    mode: 'none',
    plugins: [HtmlWebpackPluginConfig]
}
