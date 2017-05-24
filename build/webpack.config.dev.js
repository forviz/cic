'use strict';

var _ = require('lodash');
var webpack = require('webpack');

var baseConfig = require('./webpack.config.base');
var path = require('path');

module.exports = _.assign({}, baseConfig, {
  devtool: 'eval',
  entry: ['babel-polyfill',
  // necessary for hot reloading with IE:
  'eventsource-polyfill', 'react-hot-loader/patch',
  // listen to code updates emitted by hot middleware:
  'webpack-hot-middleware/client', './app/index'],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('' + process.env.NODE_ENV),
      BUILD_ENV: JSON.stringify('' + process.env.BUILD_ENV),
      npm_package_version: JSON.stringify('' + process.env.npm_package_version)
    }
  })]
});
//# sourceMappingURL=webpack.config.dev.js.map