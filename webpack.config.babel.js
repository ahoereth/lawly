/* global __dirname */
import process from 'process';
import path from 'path';
import {
  HotModuleReplacementPlugin,
  NoErrorsPlugin,
  optimize
} from 'webpack';
import autoprefixer from 'autoprefixer';
import precss from 'precss';


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
    root: path.resolve(__dirname, 'src')
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
  plugins: [
    new optimize.OccurenceOrderPlugin()
  ],
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
export default CONFIG;
