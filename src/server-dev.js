/* global require */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config.babel');

// When changing something here, also change webpack.config.
const { host, port } = config.server;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  colors: true,
  stats: { colors: true, assets: false, hash: false, chunkModules: false },
}).listen(port, host, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log(`Listening at ${host}:${port}`);
});
