/* global __dirname, require, module */
const process = require('process');
const path = require('path');
const {
  HotModuleReplacementPlugin,
  NoErrorsPlugin,
  optimize
} = require('webpack');
const autoprefixer = require('autoprefixer');
const precss = require('precss');


// *****************************************************************************
// Defaults
let config = {
  devtool: 'eval',
  target: 'web',
  entry: {
    app: './src/client',
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'assets'),
    publicPath: '/assets/',
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
  postcss: () => {
    return [autoprefixer, precss];
  },
  plugins: [],
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
    publicPath: '/assets/',
    contentBase: 'dist',
    historyApiFallback: true
  }
};




// *****************************************************************************
// Development
if (process.env.NODE_ENV === 'development') {
  config.devtool = '#cheap-module-eval-source-map';
  config.entry.tests = 'mocha!./src/tests.js';
  config.entry.dev = 'webpack-dev-server/client?http://localhost:8080';
  config.entry.hot = 'webpack/hot/dev-server';

  config.plugins.push(new HotModuleReplacementPlugin());
  config.plugins.push(new NoErrorsPlugin());
}




// *****************************************************************************
// Production
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new optimize.UglifyJsPlugin({
    mangle: true,
    compress: true,
    comments: () => false
  }));
  // OfflinePlugin https://github.com/NekR/offline-plugin
}




// *****************************************************************************
// Export
const CONFIG = config;
module.exports = CONFIG;
