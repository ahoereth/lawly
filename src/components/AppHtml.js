import React, { PropTypes } from 'react';


const AppHtml = ({
  children,
  css,
  js,
}) => (
  <html lang='de-DE'>
    <head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, minimum-scale=1.0' />
      <link rel='manifest' href='/manifest.json' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
      {css.map(src => <link rel='stylesheet' href={src} />)}
      <title>Lawly</title>
    </head>
    <body>
      <div id='app'>{children}</div>
      {js.map(src => <script src={src} type='text/javascript' />)}
    </body>
  </html>
);

AppHtml.propTypes = {
  children: PropTypes.node.isRequired,
  js: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  css: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
};


export default AppHtml;
