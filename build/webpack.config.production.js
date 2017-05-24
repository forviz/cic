'use strict';

var _ = require('lodash');
var config = require('./webpack.config.base');

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('css/style.css');

var join = path.join;

var productionConfig = _.assign({}, config, {
  devtool: 'eval',
  entry: [
  // 'babel-polyfill',
  './app/index.js'],
  output: {
    path: join(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  plugins: [
  // new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(), new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    },
    minimize: true
  }), extractCSS]
});

module.exports = productionConfig;
//# sourceMappingURL=webpack.config.production.js.map