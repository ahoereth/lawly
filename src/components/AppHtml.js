import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';


const propTypes = {
  assets: PropTypes.object.isRequired,
  children: PropTypes.node,
  js: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  css: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  state: ImmutableTypes.map.isRequired,
};


const defaultProps = {
  assets: {},
  state: Map(),
};


const AppHtml = ({
  assets,
  children,
  css,
  js,
  state,
}) => (
  <html lang='de-DE' manifest='/static/manifest.appcache'>
    <head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, minimum-scale=1.0' />
      <link rel='manifest' href='/static/manifest.json' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
      {(Array.isArray(css) ? js : [css]).map(src =>
        <link rel='stylesheet' href={src} key={src} />
      )}
      <title>Lawly</title>
    </head>
    <body>
      <div id='app'>{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__assets=${JSON.stringify(assets)}`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__state=${JSON.stringify(state.toJS())}`,
        }}
      />
      {(Array.isArray(js) ? js : [js]).map(src =>
        <script src={src} key={src} />
      )}
    </body>
  </html>
);


AppHtml.propTypes = propTypes;
AppHtml.defaultProps = defaultProps;


export default AppHtml;
