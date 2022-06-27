const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var config = {
    entry: {
        sfd: path.resolve(__dirname, "./src/js/sfd/sfd.tsx"),
        settings: path.resolve(__dirname, "./src/js/sfd/settings.tsx")
    },
    output: {
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.(t|j)sx?$/,
            use: { loader: 'ts-loader' },
            exclude: /node_modules/
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
        }, {
            enforce: "pre",
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "source-map-loader"
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
            constants: [path.resolve(__dirname, "./src/js/sfd/services/constants.ts"), 'default']
        })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    }
};

module.exports = (env, argv) => {
    const devtool = argv.mode == 'production' ? 'source-map' : false;
    config.devtool = devtool;

    return config;
};