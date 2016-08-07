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
  const HOST = 'localhost';
  const PORT = 8080;

  config = Object.assign({}, config, {
    watch: true,
    entry: Object.assign({}, config.entry, {
      app: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://${HOST}:${PORT}/`,
        'webpack/hot/only-dev-server',
        config.entry.app,
      ],
      tests: 'mocha!./tests.js',
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
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        },
      })
    ]),
    server: {
      host: HOST,
      port: PORT,
    }
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
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        },
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
