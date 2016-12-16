/* eslint-disable import/no-commonjs, object-shorthand */
/* eslint-disable prefer-template */
/* global process */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const LodashPlugin = require('lodash-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const StaticSiteGenPlugin = require('static-site-generator-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const mapValues = require('lodash/fp/mapValues');

const stringifyValues = mapValues(JSON.stringify);


const SRC = path.resolve(__dirname, 'src');
const DST = path.resolve(__dirname, 'dist');
const DEV_HOST = 'localhost';
const DEV_PORT = 8080;

const env = {
  development: {
    NODE_ENV: 'development',
    APIURL: 'http://localhost:3000/v0',
  },
  production: {
    NODE_ENV: 'production',
    APIURL: 'https://api.lawly.org/v0',
    PUBLIC_PATH: '/static/',
    GA_ID: 'UA-13272600-5',
  },
  node: {
    NODE_ENV: 'node',
    DIST_PATH: DST,
    PUBLIC_PATH: '/static/',
    APIURL: 'http://localhost:3000/v0',
  },
};


// *****************************************************************************
// Base
let config = {
  devtool: 'source-map',
  context: SRC,
  entry: {},
  output: {
    filename: '[name].js',
    path: DST,
    publicPath: '/',
  },
  resolve: {
    modules: ['node_modules', 'src', 'assets'],
    alias: { '~': SRC },
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC,
        loaders: [
          'babel-loader?cacheDirectory=tmp/cache',
          'eslint-loader',
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|png)$/i,
        loader: 'url-loader?limit=4096',
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'node_modules/react-icons'),
        loader: 'babel-loader?cacheDirectory=tmp/cache',
      },
      {
        test: /\.svg$/i,
        loader: 'svg-url-loader?noquotes&limit=4096',
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.ejs$/, loader: 'ejs-loader' },
    ],
  },
  externals: [],
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => ([
          precss,
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ],
          }),
        ]),
      },
    }),
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
    new webpack.NamedModulesPlugin(),
    new LodashPlugin({
      paths: true,
      collections: true,
      currying: true,
      flattening: true,
      placeholders: true,
    }),
  ],
};


// *****************************************************************************
// Development and production
if (process.env.NODE_ENV !== 'node') {
  config = Object.assign({}, config, {
    target: 'web',
    entry: Object.assign({}, config.entry, {
      app: 'client',
      'web-worker': 'web-worker',
    }),
    plugins: config.plugins.concat([
      new AssetsPlugin({
        filename: 'assets.json',
        prettyPrint: true,
        path: DST,
        assetsRegex: /\.(woff2?|eot|ttf)$/i,
      }),
    ]),
  });
}


// *****************************************************************************
// Development
if (process.env.NODE_ENV === 'development') {
  const hotreloading = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://' + DEV_HOST + ':' + DEV_PORT + '/',
    'webpack/hot/only-dev-server',
  ];

  config = Object.assign({}, config, {
    devtool: 'eval',
    watch: true,
    entry: Object.assign({}, config.entry, {
      app: hotreloading.concat([config.entry.app]),
      tests: hotreloading.concat(['mocha-loader!./tests.js']),
    }),
    output: Object.assign({}, config.output, {
      pathinfo: true,
    }),
    module: Object.assign({}, config.module, {
      rules: config.module.rules.concat([
        {
          test: /\.sss$/,
          loaders: [
            'style-loader',
            'css-loader?importLoaders=1',
            'postcss-loader?parser=sugarss',
          ],
        },
        { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
      ]),
    }),
    externals: config.externals.concat([
      // See http://airbnb.io/enzyme/docs/guides/webpack.html
      'react/addons',
      'react/lib/ExecutionEnvironment',
      'react/lib/ReactContext',
    ]),
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
        'process.env': stringifyValues(env.development),
      }),
      new DashboardPlugin(),
    ]),
  });
}


// *****************************************************************************
// Production and node
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'node') {
  config = Object.assign({}, config, {
    devtool: 'source-map',
    output: Object.assign({}, config.output, {
      publicPath: env.production.PUBLIC_PATH,
    }),
  });
}


// *****************************************************************************
// Production
if (process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    output: Object.assign({}, config.output, {
      filename: '[name].[chunkhash:8].js',
      path: path.resolve(DST, 'static'),
    }),
    module: Object.assign({}, config.module, {
      rules: config.module.rules.concat([
        {
          test: /\.sss$/,
          loader: ExtractTextPlugin.extract({
            loader: [
              'css-loader?importLoaders=1&minimize',
              'postcss-loader?parser=sugarss',
            ],
            fallbackLoader: 'style-loader',
          }),
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            loader: 'css-loader?minimize',
            fallbackLoader: 'style-loader',
          }),
        },
      ]),
    }),
    plugins: config.plugins.concat([
      new ExtractTextPlugin({
        filename: '[name].[contenthash:8].css',
        allChunks: true,
      }),
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
        'process.env': stringifyValues(env.production),
      }),
    ]),
  });
}


// *****************************************************************************
// Node
if (process.env.NODE_ENV === 'node') {
  config = Object.assign({}, config, {
    devtool: 'eval',
    target: 'node',
    entry: Object.assign({}, config.entry, {
      server: 'server',
      shells: 'shells',
    }),
    output: Object.assign({}, config.output, {
      filename: '[name].js',
      libraryTarget: 'umd',
    }),
    module: Object.assign({}, config.module, {
      rules: config.module.rules.concat([
        {
          test: /\.sss$/,
          loaders: [
            'css-loader?importLoaders=1',
            'postcss-loader?parser=sugarss',
          ],
        },
        { test: /\.css$/, loader: 'css-loader' },
      ]),
    }),
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins: config.plugins.concat([
      new StaticSiteGenPlugin('shells', [
        '/static/manifest.json',
        '/static/manifest.appcache',
        '/',
        '/static/home.html',
        '/static/gesetz.html',
        '/static/gesetze.html',
        '/static/impressum.html',
      ], {}),
      new webpack.DefinePlugin({
        'process.env': stringifyValues(env.node),
      }),
    ]),
  });
}


// *****************************************************************************
// Export
module.exports = config;
