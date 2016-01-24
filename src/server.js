import process from 'process';
import path from 'path';

import express from 'express';
import webpack from 'webpack';
import React from 'react';
import ReactDOM from 'react-dom/server';

import CONFIG, { ROOT } from '../webpack.config.babel';
import { Html } from './helpers';
import { App } from './containers';


const app = express();
app.use(express.static(path.join(ROOT, 'public'), { redirect: true }));


if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(CONFIG);

  /* global require */
  app.use(require('webpack-dev-middleware')(compiler, CONFIG.devServer));
  app.use(require('webpack-hot-middleware')(compiler));
}


app.get('*', function(req, res) {
  if (process.env.NOSSR) { // No searver side rendering.
    res.send(
      '<!doctype html>\n' +
      ReactDOM.renderToString(<Html />)
    );
  } else {
    res.send(
      '<!doctype html>\n' +
      ReactDOM.renderToString(<Html><App /></Html>)
    );
  }
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
