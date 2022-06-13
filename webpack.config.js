const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var config = {
    entry: {
        sfd: path.resolve(__dirname, "./src/js/sfd/sfd.jsx"),
        settings: path.resolve(__dirname, "./src/js/sfd/settings.jsx"),
        styles: "./src/js/sfd/styles.js"
    },
    output: {
        path: path.resolve(__dirname, "./src/js"),
        filename: "[name].js"
    },
    devtool: false,
    module: {
        rules: [{
            test: /\.m?jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.(scss)$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: function () {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                }
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new ESLintPlugin(),
        new Dotenv(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        })
    ]
};

module.exports = (env, argv) => {
    const devtool = argv.mode == 'production' ? 'source-map' : false;
    config.devtool = devtool;

    return config;
};