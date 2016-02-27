/* global __dirname */
import process from 'process';
import path from 'path';
import {
  HotModuleReplacementPlugin,
  NoErrorsPlugin,
  optimize
} from 'webpack';


// *****************************************************************************
// Defaults
let config = {
  devtool: 'eval',
  entry: ['./src/client'],
  output: {
    path: path.resolve(__dirname, 'dist', 'assets'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  resolve: {
    root: path.resolve(__dirname, 'src')
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
      loaders: ['style', 'css']
    },{
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.(woff|woff2|eot|ttf)$/,
      loader: 'file-loader?name=[name].[ext]'
    }]
  },
  plugins: [
    new optimize.OccurenceOrderPlugin()
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
    contentBase: 'dist',
    historyApiFallback: true
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
