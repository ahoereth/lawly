/* global __dirname, require, module */
const process = require('process');
const path = require('path');
const {
  HotModuleReplacementPlugin,
  NoErrorsPlugin,
  optimize,
  DefinePlugin,
} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const OfflinePlugin = require('offline-plugin');


// *****************************************************************************
// Defaults
let config = {
  devtool: '#cheap-module-eval-source-map',
  target: 'web',
  entry: {
    app: './src/client',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }, {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        loaders: [ 'style', 'css', 'postcss' ]
      }, {
        test: /\.sss$/,
        loaders: [
          'style',
          'css?localIdentName=[name]_[local]',
          'postcss?parser=sugarss'
        ]
      }, {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  postcss: () => {
    return [autoprefixer, precss];
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/client.ejs',
      title: 'Lawly',
      chunks: [ 'app' ],
    }),
    new OfflinePlugin({
      relativePaths: false,
      publicPath: '/',
    }),
  ],
  devServer: {
    quiet: false,
    noInfo: true,
    colors: true,
    host: 'localhost',
    port: 8080,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    },
    hot: true,
    inline: true,
    publicPath: '/',
    contentBase: 'dist',
    historyApiFallback: true
  }
};




// *****************************************************************************
// Development
if (process.env.NODE_ENV === 'development') {
  config.entry.tests = 'mocha!./src/tests.js';
  config.entry.dev = 'webpack-dev-server/client?http://localhost:8080';
  config.entry.hot = 'webpack/hot/dev-server';

  config.plugins.push(new HtmlWebpackPlugin({
    filename: 'tests.html',
    title: 'Lawly Tests',
    template: 'src/client.ejs',
    chunks: [ 'tests' ],
  }));
  config.plugins.push(new HotModuleReplacementPlugin());
  config.plugins.push(new NoErrorsPlugin());
  config.plugins.push(new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }));
}




// *****************************************************************************
// Production
if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map';

  config.plugins.push(new optimize.DedupePlugin());
  config.plugins.push(new optimize.UglifyJsPlugin({
    mangle: true,
    compress: {
      warnings: false,
    },
    comments: () => false
  }));
  config.plugins.push(new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }));
}




// *****************************************************************************
// Export
const CONFIG = config;
module.exports = CONFIG;
