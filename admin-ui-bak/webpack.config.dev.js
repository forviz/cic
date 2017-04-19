var path = require('path');
var webpack = require('webpack');

module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'source-map',
  // devtool: 'cheap-module-eval-source-map',
  entry: {
    bundle: [
      // necessary for hot reloading with IE:
      'babel-polyfill',
      'eventsource-polyfill',
      'react-hot-loader/patch',
      // listen to code updates emitted by hot middleware:
      'webpack-hot-middleware/client',
      './app/index',
    ],
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    // new webpack.ProvidePlugin({
      // React: 'react',
      // _: 'lodash',
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(`${process.env.NODE_ENV}`),
      },
    }),
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel-loader'], exclude: /node_modules/, include: __dirname },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader?sourceMap'] },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader?sourceMap',
          'css-loader',
          'sass-loader?sourceMap&sourceComments',
        ],
      },
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
          name: '[path][name].[ext]?[hash]',
        },
      },
    ],
  },
};
