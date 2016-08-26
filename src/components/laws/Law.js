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
    this.state = {
      fullscreenIndex: false,
      fullscreenNorms: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Go to fullscreen norm view when deeplinking to a norm.
    if (nextProps.deeplink) {
      this.setState({
        fullscreenIndex: false,
        fullscreenNorms: true,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  toggleFullscreenIndex = () => {
    this.setState({ fullscreenIndex: !this.state.fullscreenIndex });
  }

  render() {
    const { fullscreenIndex, fullscreenNorms } = this.state;
    const { annotations, deeplink, loading, norms, star } = this.props;
    const groupkey = norms.getIn([0, 'norm', 'groupkey'], '');

    return (
      <Grid>
        {fullscreenIndex ? null :
          <Cell col={fullscreenNorms ? 12 : 8} className='law'>
            <Norms
              annotations={annotations}
              deeplink={deeplink}
              loading={loading}
              nodes={norms}
              star={star}
            />
          </Cell>
        }
        {fullscreenNorms ? null :
          <Cell col={fullscreenIndex ? 12 : 4} className='law-sidebar'>
            {/* Prevent scrolling to a norm when clicking the expand butotn. */}
            <Link
              to={`/gesetz/${encodeURIComponent(groupkey)}`}
              style={{ color: 'inherit' }}
            >
              <IconButton
                ripple
                colored={fullscreenIndex}
                name='fullscreen'
                onClick={this.toggleFullscreenIndex}
                style={{ float: 'right' }}
              />
            </Link>
            <NormList nodes={norms} />
          </Cell>
        }
      </Grid>
    );
  }
}
