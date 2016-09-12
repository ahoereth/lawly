import http from 'http';
import fs from 'fs';
import path from 'path';

import ssr from './helpers/ssr';


http.createServer((req, res) => {
  const { url } = req;

  // Static routes.
  if (url.indexOf('/static') === 0) {
    fs.readFile(path.resolve(__dirname, url.slice(1)), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  }

  // Dynamic routes.
  ssr(url).then(rendered => {
    res.writeHead(200);
    res.end(rendered);
  }).catch(err => {
    res.writeHead(404);
    res.end(err);
  });
}).listen(8080, (err) => {
  if (err) {
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log('Listening on 8080...');
});
