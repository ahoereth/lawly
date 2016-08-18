import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Immutable from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';
import {
  Card, CardTitle, CardMenu, CardText,
  Button, IconButton,
} from 'react-mdl';

import { slugify } from '~/helpers/utils';
import { Html, Norms } from '~/components';
import styles from './norm.sss';


export default class Norm extends React.Component {
  static propTypes = {
    annotations: ImmutableTypes.mapOf(ImmutableTypes.mapContains({
      starred: PropTypes.bool,
    }).isRequired).isRequired,
    data: ImmutableTypes.mapContains({
      enumeration: PropTypes.string,
      groupkey: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string,
      foot: PropTypes.string,
    }).isRequired,
    descendants: ImmutableTypes.list.isRequired,
    star: PropTypes.func,
  };

  static defaultProps = {
    annotations: Immutable.Map(),
    descendants: Immutable.List(),
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      focus: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  expand = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  focus(state) {
    this.setState({ focus: !!state });
  }

  render() {
    const { annotations, data, descendants, star } = this.props;
    const { expanded, focus } = this.state;

    const enumeration = data.get('enumeration', '0');
    const starred = annotations.getIn([enumeration, 'starred'], false);
    const lead = enumeration === '0';
    const level = lead ? 1 : enumeration.split('.').length + 1;
    const heading = level > 6 ? 6 : level;
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
          {React.createElement(`h${heading}`, null, title)}
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
          <Html>{data.get('body', '')}</Html>
          <Html>{data.get('foot', '')}</Html>
          {expanded || descendants.isEmpty() ? (
            <Norms nodes={descendants} star={star} annotations={annotations} />
          ) : (
            <Button raised ripple onClick={this.expand}>
              Untergeordnete Normen anzeigen
            </Button>
          )}
        </CardText>
      </Card>
    );
  }
}
