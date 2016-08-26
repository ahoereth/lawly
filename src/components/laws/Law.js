import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import {
  Grid, Cell,
  Card, CardTitle, CardText,
  FABButton, Icon,
} from 'react-mdl';

import { NormList, Norms } from '~/components';
import styles from './law.sss';


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
    this.setState({
      fullscreenIndex: !this.state.fullscreenIndex,
      fullscreenNorms: false,
    });
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
              className={styles.norms}
              deeplink={deeplink}
              loading={loading}
              nodes={norms}
              star={star}
            />
          </Cell>
        }
        {fullscreenNorms ? null :
          <Cell col={fullscreenIndex ? 12 : 4} className='law-sidebar'>
            <Card className={styles.normlist} shadow={1}>
              <CardTitle><h2>Inhaltsübersicht</h2></CardTitle>
              <CardText><NormList nodes={norms.slice(1)} /></CardText>
            </Card>
          </Cell>
        }
        <Link
          to={`/gesetz/${encodeURIComponent(groupkey)}`}
          style={{ color: 'inherit' }}
        >
          <FABButton
            raised ripple
            className={styles.fab}
            onClick={this.toggleFullscreenIndex}
          >
            <Icon name={fullscreenIndex ? 'format_indent_increase' : 'menu'} />
          </FABButton>
        </Link>
      </Grid>
    );
  }
}
