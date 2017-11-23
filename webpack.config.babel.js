import webpack from 'webpack';

const path = require('path');

export default {
    devtool: 'eval',
    entry: ['./app/index.js'],

    output: {
        path: path.join(__dirname, '/public/js'),
        publicPath: '/public/js/',
        filename: 'scripts.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, './'), '.', 'node_modules'],
        extensions: ['.js'],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    devServer: {
        port: 3000,
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: '/index.html' },
            ]
        }
    }
};
