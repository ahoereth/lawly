import process from 'process';
import path from 'path';

import express from 'express';
import compression from 'compression';
import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import { Html } from './helpers';
import routes from './routes';


const app = express();
app.use(compression());


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
}


app.get('*', function(req, res) {
  if (process.env.NOSSR) {
    // No searver side rendering. Serve basic DOM without rendered app.
    res.send(
      '<!doctype html>\n' +
      renderToString(<Html />)
    );
  } else {
    // Server side rendering. Match the requested route and render the
    // complete app component tree for the current state.
    match({ routes, location: req.url }, (error, redirect, props) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirect) {
        res.redirect(302, redirect.pathname + redirect.search);
      } else if (props) {
        res.send(
          '<!doctype html>\n' +
          renderToString(<Html><RouterContext {...props} /></Html>)
        );
      } else {
        res.status(404).send('Not found');
      }
    });
  }
});


app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
