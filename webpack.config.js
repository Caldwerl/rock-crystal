const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    {
                        fallback: "style-loader",
                        use: 'css-loader'
                    }
                )
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("bundle.css"),
    ]
};
