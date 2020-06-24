const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        main: './src/index.js',
        background: './src/backgroundWindow/background.js',
        filterPlayground: './src/filterPlayground/filterPlayground.js'
    },
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
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
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'file-loader'
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
        globalObject: 'this'
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
        new HtmlWebPackPlugin({
            filename: 'filterPlayground.html',
            inject: true,
            template: 'src/filterPlayground/filterPlayground.html',
            chunks: ['filterPlayground']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyPlugin([{ from: 'src/assets', to: 'assets' }])
    ],
    devServer: {
        watchContentBase: true
    }
};
