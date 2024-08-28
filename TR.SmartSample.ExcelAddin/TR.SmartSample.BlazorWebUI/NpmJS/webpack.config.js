const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader",],
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
              { from: "./node_modules/@pdftron/webviewer/public", to: "../webviewer" },
            ],
        }),
    ],
    output: {
        path: path.resolve(__dirname, '../wwwroot/js'),
        filename: "index.bundle.js"
    }
};