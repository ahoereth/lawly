import process from 'process';
import path from 'path';
import webpack from 'webpack';


/* global __dirname */
export const ROOT = __dirname;


let devtool;
let entry = ['./src/index'];
let plugins, devServer;


if (process.env.NODE_ENV === 'development') {
  devServer = {
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
    publicPath: '/assets/'
  };

  devtool = '#cheap-module-eval-source-map';
  entry.push('webpack-hot-middleware/client');

  plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];
}


const config = {
  devtool: devtool || 'eval',
  entry: entry || ['./src/index'],
  output: {
    path: path.join(ROOT, 'public'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: [
      './src',
      './node_modules'
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.js$/,
      loader: 'eslint-loader',
      include: 'src'
    }]
  },
  devServer: devServer || {},
  plugins: plugins || []
};


export default config;
