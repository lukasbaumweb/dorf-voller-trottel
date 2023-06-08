const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
      title: "Dorf voller Trottel",
      template: "app/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "public", to: "public" }],
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
    client: {
      overlay: false,
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
