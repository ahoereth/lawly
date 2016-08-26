import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, IconButton } from 'react-mdl';
import { Link } from 'react-router';

import { NormList, Norms } from '~/components';


export default class Law extends React.Component {
  static propTypes = {
    annotations: ImmutableTypes.mapOf(ImmutableTypes.map).isRequired,
    deeplink: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    norms: ImmutableTypes.list.isRequired,
    star: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  componentWillReceiveProps(nextProps) {
    // Go back to norm view when selecting a norm from the expanded overview.
    if (!this.props.deeplink && nextProps.deeplink) {
      this.setState({ expanded: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  toggleExpandedIndex = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { expanded } = this.state;
    const { annotations, deeplink, loading, norms, star } = this.props;
    const groupkey = norms.getIn([0, 'norm', 'groupkey'], '');

    return (
      <Grid>
        {expanded ? null :
          <Cell col={8} className='law'>
            <Norms
              annotations={annotations}
              deeplink={deeplink}
              loading={loading}
              nodes={norms}
              star={star}
            />
          </Cell>
        }
        <Cell col={expanded ? 12 : 4} className='law-sidebar'>
          {/* Prevent scrolling to a norm when clicking the expand butotn. */}
          <Link
            to={`/gesetz/${encodeURIComponent(groupkey)}`}
            style={{ color: 'inherit' }}
          >
            <IconButton
              ripple
              colored={expanded}
              name='fullscreen'
              onClick={this.toggleExpandedIndex}
              style={{ float: 'right' }}
            />
          </Link>
          <NormList nodes={norms} />
        </Cell>
      </Grid>
    );
  }
}
