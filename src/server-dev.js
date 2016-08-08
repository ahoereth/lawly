/* eslint-disable no-console, import/no-commonjs */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');

// When changing something here, also change webpack.config.
const { host, port } = config.server;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  colors: true,
  stats: { colors: true, assets: false, hash: false, chunkModules: false },
}).listen(port, host, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening at ${host}:${port}`);
  }
});
