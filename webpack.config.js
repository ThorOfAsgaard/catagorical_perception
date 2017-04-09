var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        'bin/bundle':'./src/index.js',

    },
    output: { filename: '[name].js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
};