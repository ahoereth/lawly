import process from 'process';
import path from 'path';
import {
  HotModuleReplacementPlugin,
  NoErrorsPlugin,
  optimize
} from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';


// *****************************************************************************
// Defaults
let config = {
  devtool: 'eval',
  entry: ['./src/client'],
  output: {
    path: path.resolve(__dirname, 'dist', 'assets'), /* global __dirname */
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        plugins: [
          'transform-class-properties',
          'transform-export-extensions',
          'transform-object-rest-spread'
        ]
      }
    }, {
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }, {
      test: /\.(woff|woff2|eot|ttf)$/,
      loader: 'file-loader?name=[name].[ext]'
    }]
  },
  plugins: [
    new optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('bundle.css')
  ],
  devServer: {
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    hot: true,
    publicPath: '/assets/',
    contentBase: 'dist'
  }
};




// *****************************************************************************
// Development
if (process.env.NODE_ENV === 'development') {
  config.devtool = '#cheap-module-eval-source-map';
  config.entry.unshift('webpack-dev-server/client?http://localhost:8080');
  config.entry.unshift('webpack/hot/dev-server');

  // Configure babel
  config.module.loaders[0].query.plugins.push(
    ['react-transform', {
      transforms: [{
        transform: 'react-transform-hmr',
        imports: [ 'react' ],
        locals: [ 'module' ]
      }]
    }]
  );

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
