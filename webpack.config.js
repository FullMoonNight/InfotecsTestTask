const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpaclPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const DEV = process.env.NODE_ENV === "development";

let filename = (ext) => (DEV ? `[name].${ext}` : `[contenthash].${ext}`);

let opt = () => {
  let conf = {};
  if (!DEV) {
    conf.minimizer = [new TerserWebpaclPlugin(), new OptimizeCssAssetsWebpackPlugin()];
  }
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    index: "./index.js",
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  optimization: opt(),
  resolve: {
    extensions: [".js", ".json", ".scss"],
    alias: {
      "@style": path.resolve(__dirname, "src/scss"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@scripts": path.resolve(__dirname, "src/assets/scripts"),
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/svg"),
          to: path.resolve(__dirname, "dist/svg"),
        },
      ],
    }),
  ],
  devServer: {
    port: 1234,
    hot: DEV,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: DEV,
              reloadAll: true,
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)/,
        use: ["file-loader"],
      },
    ],
  },
};
