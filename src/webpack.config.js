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
        popup: path.resolve(__dirname, "src", "ui", "popup.ts"),
        init: path.resolve(__dirname, "src", "content", "init.ts"),
        extension: path.resolve(__dirname, "src", "content", "extension.ts"),
    },
    output: {
        clean: true,
        path: path.join(__dirname, "../dist"),
        filename: (pathData) => {
            const name = pathData.chunk.name;
            if (name === "popup") return "ui/[name].js"
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