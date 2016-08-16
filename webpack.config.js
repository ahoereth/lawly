/* eslint-disable no-var, vars-on-top, import/no-commonjs */
/* global process */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');


// *****************************************************************************
// Base
var config = {
  devtool: '#cheap-module-eval-source-map',
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: 'client',
    'web-worker': 'web-worker',
    'service-worker': 'service-worker',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules', 'src'],
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel', 'eslint'], exclude: /node_modules/ },
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
if (process && process.env.NODE_ENV === 'development') {
  var HOST = 'localhost';
  var PORT = 8080;

  var dashboard = new Dashboard();
  var hotreloading = [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${HOST}:${PORT}/`,
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
      host: HOST,
      port: PORT,
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
        mangle: true,
        compress: {
          warnings: false,
        },
        comments: () => false,
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
