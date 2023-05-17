const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    chunkFilename: "[id].[chunkhash].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|xml|webmanifest)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    static: "./dist",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
