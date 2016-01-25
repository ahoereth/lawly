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
    path: path.join(__dirname, 'dist', 'assets'), /* global __dirname */
    publicPath: '/',
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
          'transform-export-extensions'
        ]
      }
    }, {
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new optimize.OccurenceOrderPlugin()
  ]
};




// *****************************************************************************
// Development
if (process.env.NODE_ENV === 'development') {
  config.devServer = {
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
    publicPath: '/'
  };

  config.devtool = '#cheap-module-eval-source-map';
  config.entry.push('webpack-hot-middleware/client');

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
