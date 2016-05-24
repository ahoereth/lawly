import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Card, CardTitle, CardMenu, CardText,
  IconButton
} from 'react-mdl';

import { slugify } from 'helpers/utils';
import Html from 'components/Html';
import styles from './norm.sss';


export default class Norm extends React.Component {
  static propTypes = {
    annotations: ImmutablePropTypes.mapContains({
      starred: PropTypes.bool,
    }).isRequired,
    data: ImmutablePropTypes.mapContains({
      enumeration: PropTypes.string.isRequired,
      groupkey: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      foot: PropTypes.string.isRequired,
    }).isRequired,
    star: PropTypes.func,
  };

  static defaultProps = {
    annotations: Immutable.Map(),
  };

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  focus(state) {
    this.setState({ focus: !!state });
  }

  render() {
    const { annotations, data, star } = this.props;
    const { focus } = this.state;

    const starred = annotations.get('starred');
    const lead = data.get('enumeration') === '0';

    let heading = data.get('enumeration').split('.').length + 1;
    heading = lead ? 1 : (heading > 6 ? 6 : heading);
    const icons = lead ? ['book', 'book'] : ['bookmark', 'bookmark_border'];

    const title = !lead ? data.get('title') :
      [<span key='key'>{data.get('groupkey')}</span>, data.get('title')];

    const slug = slugify(data.get('title'));
    return (
      <Card
        className={styles.norm}
        id={slug}
        shadow={focus ? 1 : undefined}
        onMouseEnter={() => this.focus(true)}
        onMouseLeave={() => this.focus(false)}
      >
        <CardTitle>
          {React.createElement('h' + heading, null, title)}
        </CardTitle>
        <CardMenu>
          <IconButton
            ripple
            colored={starred}
            name={starred ? icons[0] : icons[1]}
            onClick={() => star(data, !starred)}
          />
        </CardMenu>
        <CardText>
          <Html>{data.get('body')}</Html>
          <Html>{data.get('foot')}</Html>
        </CardText>
      </Card>
    );
  }
}
