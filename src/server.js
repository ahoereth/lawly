import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from '../webpack.config.babel';


const app = express();


if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, config.devServer));
  app.use(require('webpack-hot-middleware')(compiler));
}


app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', req.path));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
