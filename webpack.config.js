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
var LodashPlugin = require('lodash-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');



var SRC = path.resolve(__dirname, 'src');
var DST = path.resolve(__dirname, 'dist');
var DEV_HOST = 'localhost';
var DEV_PORT = 8080;


// *****************************************************************************
// Base
var config = {
  devtool: 'cheap-module-source-map',
  target: 'web',
  context: SRC,
  entry: {},
  output: {
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules', 'src'],
    alias: { '~': SRC },
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', include: SRC },
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: SRC,
        query: { cacheDirectory: path.resolve(__dirname, 'cache') },
      },
      { test: /\.(woff|woff2|eot|ttf)$/, loader: 'file?name=[name].[ext]' },
      { test: /\.json$/, loader: 'json', exclude: /manifest.json$/ },
      { test: /\.ejs$/, loader: 'ejs' },
    ],
  },
  externals: {},
  postcss: function () {
    return [
      precss,
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
      }),
    ];
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
    new LodashPlugin(),
  ],
};


// *****************************************************************************
// Development and production
if (process.env.NODE_ENV !== 'node') {
  config = Object.assign({}, config, {
    entry: Object.assign({}, config.entry, {
      app: 'client',
      'web-worker': 'web-worker',
    }),
    output: Object.assign({}, config.output, {
      path: path.resolve(DST, 'static'),
      publicPath: '/',
    }),
    plugins: config.plugins.concat([
      new AssetsPlugin({
        filename: 'assets.json',
        prettyPrint: true,
        path: DST,
      }),
    ]),
  });
}


// *****************************************************************************
// Development
if (process.env.NODE_ENV === 'development') {
  var dashboard = new Dashboard();
  var hotreloading = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://' + DEV_HOST + ':' + DEV_PORT + '/',
    'webpack/hot/only-dev-server',
  ];

  config = Object.assign({}, config, {
    watch: true,
    entry: Object.assign({}, config.entry, {
      app: hotreloading.concat([config.entry.app]),
      tests: hotreloading.concat(['mocha!./tests.js']),
    }),
    output: Object.assign({}, config.output, {
      pathinfo: true,
      filename: '[name].[hash:8].js',
    }),
    module: Object.assign({}, config.module, {
      loaders: config.module.loaders.concat([
        {
          test: /\.c|sss$/,
          loaders: ['style', 'css', 'postcss?parser=sugarss'],
        },
      ]),
    }),
    externals: Object.assign({}, config.externals, {
      // See https://github.com/airbnb/enzyme/issues/47
      cheerio: 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true,
    }),
    plugins: config.plugins.concat([
      new HtmlWebpackPlugin({
        template: 'client.ejs',
        title: 'Lawly',
        chunks: ['app'],
      }),
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
// Production and node
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'node') {
  config = Object.assign({}, config, {
    devtool: 'source-map',
    output: Object.assign({}, config.output, {
      filename: '[name].[chunkhash:8].js',
    }),
    module: Object.assign({}, config.module, {
      loaders: config.module.loaders.concat([
        {
          test: /\.s|css$/,
          loader: ExtractTextPlugin.extract({
            // TODO: Fix minification.
            loader: ['css?-minimize', 'postcss?parser=sugarss'],
            fallbackLoader: 'style',
          }),
        },
      ]),
    }),
    plugins: config.plugins.concat([
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      // TODO: Stop generating a file when in node environment.
      // See: https://github.com/webpack/extract-text-webpack-plugin/issues/164
      new ExtractTextPlugin('[name].[contenthash:8].css'),
    ]),
  });
}


// *****************************************************************************
// Production
if (process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    output: Object.assign({}, config.output, {
      publicPath: '/static/',
    }),
    plugins: config.plugins.concat([
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
    ]),
  });
}


// *****************************************************************************
// Node
if (process.env.NODE_ENV === 'node') {
  config = Object.assign({}, config, {
    devtool: 'eval',
    entry: Object.assign({}, config.entry, {
      server: 'server',
      shells: 'shells',
    }),
    output: Object.assign({}, config.output, {
      filename: '[name].js',
      path: DST,
      publicPath: '/',
      libraryTarget: 'umd',
    }),
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins: config.plugins.concat([
      new StaticSiteGeneratorPlugin('shells', [
        '/static/',
        '/static/manifest.appcache',
        '/static/home.html',
        '/static/gesetz.html',
        '/static/gesetze.html',
      ], {}),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('node'),
          DIST_PATH: JSON.stringify(DST),
        },
      }),
    ]),
  });
}


// *****************************************************************************
// Export
module.exports = config;
