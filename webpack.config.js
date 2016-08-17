/* eslint-disable no-var, vars-on-top, import/no-commonjs, object-shorthand */
/* eslint-disable prefer-template */
/* global process */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');


var SRC = path.resolve(__dirname, 'src');
var DEV_HOST = 'localhost';
var DEV_PORT = 8080;


// *****************************************************************************
// Base
var config = {
  devtool: 'cheap-module-source-map',
  target: 'web',
  context: SRC,
  entry: {
    app: 'client',
    'web-worker': 'web-worker',
    'service-worker': 'service-worker',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash:8].js',
  },
  resolve: {
    modules: ['node_modules', 'src'],
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', include: SRC },
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel', include: SRC },
      { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
      { test: /\.sss$/, loaders: ['style', 'css', 'postcss?parser=sugarss'] },
      { test: /\.(woff|woff2|eot|ttf)$/, loader: 'file?name=[name].[ext]' },
    ],
  },
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  postcss: () => [autoprefixer, precss],
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client.ejs',
      title: 'Lawly',
      chunks: ['app'],
      minify: { collapseWhitespace: true },
    }),
  ],
};


// *****************************************************************************
// Development
if (process && process.env.NODE_ENV !== 'production') {
  var dashboard = new Dashboard();
  var hotreloading = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://' + DEV_HOST + ':' + DEV_PORT + '}/',
    'webpack/hot/only-dev-server',
  ];

  config = Object.assign({}, config, {
    watch: true,
    entry: Object.assign({}, config.entry, {
      app: hotreloading.concat([config.entry.app]),
      tests: hotreloading.concat(['mocha!./tests.js']),
    }),
    plugins: config.plugins.concat([
      new HtmlWebpackPlugin({
        filename: 'tests.html',
        title: 'Lawly Tests',
        template: 'client.ejs',
        chunks: ['tests'],
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }),
      new DashboardPlugin(dashboard.setData),
    ]),
    server: {
      host: DEV_HOST,
      port: DEV_PORT,
    },
  });
}


// *****************************************************************************
// Production
if (process && process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    devtool: 'source-map',
    plugins: config.plugins.concat([
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ]),
  });
}


// *****************************************************************************
// Export
module.exports = config;
