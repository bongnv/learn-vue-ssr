const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const base = require('./webpack.base.config');
const isProduction = process.env.NODE_ENV === 'production';
const srcPath = path.resolve(process.cwd(), 'src');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(base, {
  entry: {
    app: path.join(srcPath, 'client-entry.js')
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    filename: isProduction ? '[name].[hash].js' : '[name].js',
    sourceMapFilename: isProduction ? '[name].[hash].js.map' : '[name].js.map',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: !isProduction } },
          'postcss-loader',
        ]
      },
    ]
  },

  plugins: (isProduction ?
    [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new VueLoaderPlugin(),
      new VueSSRClientPlugin(),
      new BundleAnalyzerPlugin(),
    ]
    :
    [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        hmr: true,
      }),
      new VueLoaderPlugin(),
      new VueSSRClientPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ]
  )
});
