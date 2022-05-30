const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

var config = {
    entry: {
        sfd: path.resolve(__dirname, "./src/js/sfd/sfd.jsx"),
        settings: path.resolve(__dirname, "./src/js/sfd/settings.jsx")
    },
    output: {
        path: path.resolve(__dirname, "./src/js"),
        filename: "[name].js"
    },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new ESLintPlugin(),
        new Dotenv()
    ]
};

module.exports = (env, argv) => {
    return config;
};