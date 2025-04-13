const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "development",
    optimization: {
        minimize: false
    },
    devtool: 'cheap-module-source-map',
    entry: {
        background: path.resolve(__dirname, "src", "background.ts"),
        popup: path.resolve(__dirname, "src", "popup", "index.ts"),
        init: path.resolve(__dirname, "src", "content", "init.ts"),
        main: path.resolve(__dirname, "src", "main.ts"),
    },
    output: {
        clean: true,
        path: path.join(__dirname, "../dist"),
        filename: (pathData) => {
            const name = pathData.chunk.name;
            if (name === "popup") return "popup/index.js"
            if (name === "init") return "content/[name].js"
            return "[name].js";
        }
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: ".", context: "public"}]
        }),
    ],
};