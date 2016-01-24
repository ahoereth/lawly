import path from 'path'
import webpack from 'webpack';

const ROOT = path.resolve(__dirname);


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
    path: 'public',
    publicPath: '/'
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
    path: path.join(__dirname, 'public', 'assets'),
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
      loader: 'babel',
    }]
  },
  devServer: devServer || {},
  plugins: plugins || []
};


export default config;
