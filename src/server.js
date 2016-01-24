import process from 'process';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import CONFIG, { ROOT } from '../webpack.config.babel';


const app = express();


if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(CONFIG);

  /* global require */
  app.use(require('webpack-dev-middleware')(compiler, CONFIG.devServer));
  app.use(require('webpack-hot-middleware')(compiler));
}


app.get('*', function(req, res) {
  res.sendFile(path.join(ROOT, 'public', req.path));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
