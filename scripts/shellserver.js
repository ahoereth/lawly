/* eslint-disable import/no-commonjs */
const http = require('http');
const fs = require('fs');
const path = require('path');


const PATH = path.resolve(__dirname, '..', 'dist');


http.createServer((req, res) => {
  const { url } = req;

  let file = 'static/index.html';

  if (url.indexOf('/static') === 0) {
    file = url.slice(1);
  } else if (url.indexOf('/gesetze') === 0) {
    file = 'static/gesetze.html';
  } else if (url.indexOf('/gesetz') === 0) {
    file = 'static/gesetz.html';
  } else if (url === '/') {
    file = 'static/home.html';
  }

  fs.readFile(path.resolve(PATH, file), (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
}).listen(8080, (err) => {
  if (err) {
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log('Listening on 8080...');
});
