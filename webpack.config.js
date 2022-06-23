const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var config = {
    entry: {
        sfd: path.resolve(__dirname, "./src/js/sfd/sfd.jsx"),
        settings: path.resolve(__dirname, "./src/js/sfd/settings.jsx")
    },
    output: {
        path: path.resolve(__dirname, "./src/dist"),
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
            filename: "[name].css"
        }),
        new ESLintPlugin(),
        new Dotenv(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            constants: [path.resolve(__dirname, "./src/js/sfd/services/constants.js"), 'default']
        })
    ]
};

module.exports = (env, argv) => {
    const devtool = argv.mode == 'production' ? 'source-map' : false;
    config.devtool = devtool;

    return config;
};