const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const conditional = require('express-conditional-middleware');
const webpack = require('webpack');
const fs = require('fs');
const bodyParser = require('body-parser');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {app:'./src/app.js'}
  , module: { 
      rules: [
        {
            exclude: /node_modules/,
            test: /.jst$/,
            use: [
                {
                    loader:  '@appfibre/jst-syntax'/*, options: { "parse": { "function": {parseAst: () => console.log(123) }} } */
                    /*, query: {
                      presets: ['es2015', "stage-0"],
                      plugins: ['@babel/transform-class-properties', '@babel/transform-classes']
                  }*/
                }
            ]
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              'sass-loader'
            ]
          })
        }
    ],
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    inline: true,
    publicPath: '/',
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    before(app){
      app.use(bodyParser.text({"type": "application/jst"}));
      app.use(conditional( req => req.headers["content-type"] === 'application/jst', 
        function (req, res, next) {
          var filename = req.originalUrl;
          while (filename.indexOf('/') > -1)
            filename = filename.replace('/', '\\');

          if (req.method == "GET")
            res.sendFile(__dirname + filename);
          else if (req.method == "POST") {
            fs.writeFile(__dirname + filename, req.body, err => console.log(err)); 
            res.sendFile(__dirname + filename);
          }
          else if (req.method == "DELETE") {
            fs.unlink(__dirname + filename, err => console.log(err));
            res.status(204).send();
          }
        }
      ));
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin("styles.css"),
    new CopyWebpackPlugin([{ from: 'src/assets', to: '' }]),
    new HtmlWebpackPlugin({chunks: ['app'], filename: 'index.html', template: './src/index.html', inject: "head"}),
    new HtmlWebpackPlugin({chunks: ['tests'], filename: 'tests.html'}),
    new HtmlWebpackPlugin({chunks: ['designer'], filename: 'designer.html'}),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name]_bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};