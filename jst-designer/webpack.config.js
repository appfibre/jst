const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');



module.exports = {
    context: ROOT,

    entry: {
        'main': './index.jst',
        'blank': './blank.jst',
        'proxy': './proxy.ts'
    },
    
    output: {
        filename: '[name].js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    mode: 'development',

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{ from: '../cdn', to: 'cdn' }]),        
//        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({chunks: ['main'], filename: 'index.html', template: './index.html', inject: "head"}),
        new HtmlWebpackPlugin({chunks: ['proxy'], filename: 'proxy.html', inject: "head"}),
        new webpack.HotModuleReplacementPlugin()
    ],

    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'tslint-loader'
            },

            /****************
            * LOADERS
            *****************/
            {
                test: /\.ts$/,
                exclude: [ /node_modules/ ],
                use: 'ts-loader'
            },
            {
                test: /.jst$/,
                exclude: [ /node_modules/ ],
                use: [
                    {
                        loader:  '@appfibre/jst-syntax'/*, options: { "parse": { "function": {parseAst: () => console.log(123) }} } */
                        /*, query: {
                          presets: ['es2015', "stage-0"],
                          plugins: ['@babel/transform-class-properties', '@babel/transform-classes']
                      }*/
                    }
                ]
    
            }
        ]
    },

    devtool: 'cheap-module-source-map',
    devServer: {}
};

