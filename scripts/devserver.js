/* eslint-disable no-console, import/no-commonjs */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');

const DEV_HOST = 'localhost';
const DEV_PORT = 8000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: {
    disableDotRule: true,
  },
  // quiet: true,
}).listen(DEV_PORT, DEV_HOST, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening at ${DEV_HOST}:${DEV_PORT}`);
  }
});
