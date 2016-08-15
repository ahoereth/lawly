/* eslint-disable import/no-commonjs */
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
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');



// *****************************************************************************
// Base
let config = {
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
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js'],
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
if (process.env.NODE_ENV === 'development') {
  const HOST = 'localhost';
  const PORT = 8080;

  const dashboard = new Dashboard();
  const hotreloading = [
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
      new HotModuleReplacementPlugin(),
      new NoErrorsPlugin(),
      new DefinePlugin({
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
if (process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    devtool: 'source-map',
    plugins: config.plugins.concat([
      new optimize.DedupePlugin(),
      new optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false,
        },
        comments: () => false,
      }),
      new DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ]),
  });
}


// *****************************************************************************
// Export
const CONFIG = config;
module.exports = CONFIG;
