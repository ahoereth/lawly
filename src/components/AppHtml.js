import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';
import { isString, isPlainObject } from 'lodash';


const propTypes = {
  appcache: PropTypes.string,
  assets: PropTypes.object.isRequired,
  children: PropTypes.node,
  js: PropTypes.array.isRequired,
  css: PropTypes.array.isRequired,
  state: ImmutableTypes.map.isRequired,
  manifest: PropTypes.string.isRequired,
  meta: PropTypes.arrayOf((p, k, c, l, n) => (
    (p[k].length === 2 && isString(p[k][0]) && isPlainObject(p[k][1])) ?
      undefined : new Error(`Invalid prop \`${n}\` supplied to \`${c}\`.`)
  )),
  title: PropTypes.string,
};


const defaultProps = {
  assets: {},
  state: Map(),
  manifest: '/manifest.json',
  meta: [],
  title: 'Lawly',
};


/* eslint-disable max-len */
const AppHtml = ({
  appcache,
  assets,
  children,
  css,
  js,
  state,
  manifest,
  meta,
  title,
}) => (
  <html lang='de-DE' manifest={appcache}>
    <head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, minimum-scale=1.0' />
      <link rel='manifest' href={manifest} />
      <link rel='shortcut icon' sizes='16x16 24x24 32x32 48x48 64x64' href='/static/img/icon.ico' />
      {meta.map(([tag, props], idx) => (
        React.createElement(tag, { ...props, key: idx })
      ))}
      <script>{`
       WebFontConfig = { google: { families: [ 'Roboto:400,400i,700,700i' ] } };
       (function(d) {
          var wf = d.createElement('script'), s = d.scripts[0];
          wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js';
          s.parentNode.insertBefore(wf, s);
       })(document);
      `}</script>
      {css.map(src => (
        <link rel='stylesheet' href={src} key={src} />
      ))}
    </head>
    <body>
      <div id='app'>{children}</div>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `window.__assets=${JSON.stringify(assets)}`,
        }}
      />
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `window.__state=${JSON.stringify(state.toJS())}`,
        }}
      />
      {js.map(src => (
        <script src={src} key={src} />
      ))}
    </body>
  </html>
);


AppHtml.propTypes = propTypes;
AppHtml.defaultProps = defaultProps;


export default AppHtml;
