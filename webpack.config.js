const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        main: './src/index.js',
        background: './src/backgroundWindow/background.js'
    },
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.css$/,
                loader: 'style-loader'
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: '[name]__[local]--[hash:base64:5]'
                    }
                }
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            }
        ]
    },
    output: {
        globalObject: 'this',
        hashFunction: 'sha256'
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, './src/components/'),
            mainProcess: path.resolve(__dirname, './src/mainProcess/'),
            store: path.resolve(__dirname, './src/store/'),
            utils: path.resolve(__dirname, './src/utils/'),
            assets: path.resolve(__dirname, './src/assets/'),
            plotting: path.resolve(__dirname, './src/plotting/'),
            filters: path.resolve(__dirname, './src/filters/')
        },
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
        new HtmlWebPackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['main']
        }),
        new HtmlWebPackPlugin({
            filename: 'background.html',
            template: 'src/backgroundWindow/background.html',
            chunks: ['background']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
                { from: 'third-party-packages/gifjs', to: 'gifjs' }
            ]
        }),
        new WebpackBuildNotifierPlugin({
            title: 'webpack built',
            showDuration: true
        }),
        new ProgressBarPlugin()
    ],
    devServer: {
        watchContentBase: true
    }
};
