import React, { PropTypes } from 'react';
import { Content as MaterialContent, Grid, Cell } from 'react-mdl';


class Content extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children } = this.props;

    return (
      <MaterialContent>
        <Grid>
          <Cell col={12}>{children}</Cell>
        </Grid>
      </MaterialContent>
    );
  }
}


export default Content;
