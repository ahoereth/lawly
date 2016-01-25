import React, { PropTypes } from 'react';


class Html extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children } = this.props;

    return (
      <html lang='de'>
        <head>
          <meta charSet='UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title>lawlyapp</title>
        </head>
        <body>
          <div id='app'>{children}</div>
          <script src='/bundle.js' />
        </body>
      </html>
    );
  }
}


export default Html;
