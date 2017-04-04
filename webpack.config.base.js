// import 'babel-polyfill';
const webpack = require('webpack');

const path = require('path');

const DEBUG = process.env.NODE_ENV !== 'development';

const config = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'npm_package_version',
    ]),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/],
      },
      // { test: /\.scss$/, loader: 'style!css?sourceMap!sass?sourceMap&sourceComments' },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader?sourceMap'] },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader?sourceMap',
          'css-loader',
          'sass-loader?sourceMap&sourceComments',
        ],
      },
      // { test: /\.(woff2?|ttf|eot|svg|jpg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        /*
        query: {
          name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
          limit: 10000,
        },*/
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        query: {
          name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
        },
      },
    ],
  },
};

module.exports = config;
