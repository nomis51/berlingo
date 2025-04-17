/*
 * This file is part of Berlingo
 *
 * Copyright (C) 2025 nomis51
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "production",
    optimization: {
        minimize: true,
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
            patterns: [
                {
                    from: ".",
                    to: ".",
                    context: "public"
                }, {
                    from: path.resolve(__dirname, '..', 'LICENSE'),
                    to: 'LICENSE',
                    toType: 'file'
                }, {
                    from: path.resolve(__dirname, '..', 'README.md'),
                    to: 'README.md'
                }
            ]
        }),
    ],
};