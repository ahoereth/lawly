import process from 'process';
import path from 'path';

import express from 'express';
import compression from 'compression';
import webpack from 'webpack';
import React from 'react';
import ReactDOM from 'react-dom/server';

import { Html } from './helpers';
import { App } from './containers';


const app = express();


// Development specific
if (process.env.NODE_ENV === 'development') {
  /* global require */
  const CONFIG = require('../webpack.config.babel').default;
  const compiler = webpack(CONFIG);

  app.use(require('webpack-dev-middleware')(compiler, CONFIG.devServer));
  app.use(require('webpack-hot-middleware')(compiler));
}


// Production specific
if (process.env.NODE_ENV === 'production') {
  /* global __dirname */
  app.use(express.static(path.join(__dirname, '..', 'assets')));
  app.use(compression());
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
