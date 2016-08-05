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
// Base
let config = {
  devtool: '#cheap-module-eval-source-map',
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: 'client',
    worker: 'helpers/LocalSearchWorker',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    modules: [ 'node_modules', path.resolve(__dirname, 'src') ],
    extensions: [ '.js', '.ts', '.tsx' ]
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: [ 'babel', 'eslint' ], exclude: /node_modules/},
      { test: /\.css$/, loaders: [ 'style', 'css', 'postcss' ] },
      { test: /\.sss$/, loaders: [ 'style', 'css', 'postcss?parser=sugarss' ] },
      { test: /\.(woff|woff2|eot|ttf)$/, loader: 'file?name=[name].[ext]' }
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
      template: 'client.ejs',
      title: 'Lawly',
      chunks: [ 'app' ],
      minify: { collapseWhitespace: true, }
    }),
  ],
};




// *****************************************************************************
// Development
if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    watch: true,
    entry: Object.assign({}, config.entry, {
      tests: 'mocha!./tests.js',
      dev: 'webpack-dev-server/client?http://localhost:8080',
      hot: 'webpack/hot/dev-server',
    }),
    plugins: config.plugins.concat([
      new HtmlWebpackPlugin({
        filename: 'tests.html',
        title: 'Lawly Tests',
        template: 'client.ejs',
        chunks: [ 'tests' ],
      }),
      new HotModuleReplacementPlugin(),
      new NoErrorsPlugin(),
      new DefinePlugin({
        'DEBUG': true,
      })
    ]),
    devServer: {
      quiet: false,
      noInfo: true,
      colors: true,
      host: 'localhost',
      port: 8080,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      hot: true,
      inline: true,
      publicPath: '/',
      contentBase: 'dist',
      historyApiFallback: true
    },
  });
}




// *****************************************************************************
// Production
if (process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    devtool: 'source-map',
    entry: Object.assign({}, config.entry, {
      'sw-entry': 'sw-entry',
    }),
    plugins: config.plugins.concat([
      new optimize.DedupePlugin(),
      new optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false,
        },
        comments: () => false
      }),
      new DefinePlugin({
        'DEBUG': false,
      }),
      new OfflinePlugin({
        relativePaths: false,
        publicPath: '/',
        caches: {
          main: [ 'index.html',  ':rest:' ],
        },
        externals: [ 'index.html' ],
        ServiceWorker: {
          output: 'sw.js',
          entry: 'sw-entry.js',
        },
        AppCache: {
          FALLBACK: { '/': '/' },
        },
      })
    ]),
  });
}




// *****************************************************************************
// Export
const CONFIG = config;
module.exports = CONFIG;
