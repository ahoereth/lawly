import React, { PropTypes } from 'react';
import serialize from 'serialize-javascript';


class Html extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    state: PropTypes.object
  };

  render() {
    const { children, state } = this.props;
    const serializedState = serialize(state || {});

    return (
      <html lang='de'>
        <head>
          <meta charSet='UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title>lawlyapp</title>
        </head>
        <body>
          <div id='app'>{children}</div>
          <script
            type='text/javascript' charSet='UTF-8'
            dangerouslySetInnerHTML={{
              __html: `window.__state=${serializedState}`
            }}
          />
          <script src='/bundle.js' />
        </body>
      </html>
    );
  }
}


export default Html;
