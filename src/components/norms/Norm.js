import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Immutable from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import classNames from 'classnames';
import {
  Card, CardTitle, CardMenu, CardText,
  Button, IconButton,
} from 'react-mdl';

import { slugify } from '~/helpers/utils';
import { Html, Norms } from '~/components';
import { getTextblock, getTextline } from '~/helpers/shells';
import styles from './norm.sss';


export function getNormLink(groupkey, enumeration, title) {
  if (!groupkey) { return ''; }
  const key = encodeURIComponent(groupkey);
  if (!enumeration) { return `/gesetz/${key}`; }
  if (!title) { return `/gesetz/${key}/${enumeration}`; }
  return `/gesetz/${key}/${enumeration}#${slugify(title)}`;
}


export default class Norm extends React.Component {
  static propTypes = {
    annotations: ImmutableTypes.mapOf(ImmutableTypes.mapContains({
      starred: PropTypes.bool,
    }).isRequired).isRequired,
    data: ImmutableTypes.mapContains({
      enumeration: PropTypes.string,
      groupkey: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
      foot: PropTypes.string,
    }).isRequired,
    deeplink: PropTypes.string.isRequired,
    descendants: ImmutableTypes.list.isRequired,
    star: PropTypes.func,
  };

  static defaultProps = {
    annotations: Immutable.Map(),
    descendants: Immutable.List(),
    deeplink: '',
  };

  constructor(props) {
    super(props);
    const { data, deeplink } = props;
    this.shell = data.get('enumeration', '0') === '0' ? [
      getTextline('title'), getTextblock(8),
    ] : [null, null];
    this.state = {
      expanded: deeplink.indexOf(data.get('enumeration', '0')) === 0,
      focused: false,
    };
  }

  componentDidMount() {
    const { data, deeplink } = this.props;
    this.deeplink(deeplink, data.get('enumeration'));
  }

  componentWillReceiveProps(nextProps) {
    const { data, deeplink } = nextProps;
    if (deeplink !== this.props.deeplink) {
      this.deeplink(deeplink, data.get('enumeration', '0'));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  deeplink(deeplink, enumeration) {
    this.setState({ expanded: deeplink.indexOf(enumeration) === 0 });
    if (this.elem && deeplink === enumeration) {
      this.elem.scrollIntoView();
    }
  }

  expand = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  focus(state = !this.state.focus) {
    this.setState({ focused: !!state });
  }

  saveElemRef = ref => {
    this.elem = ref;
  }

  render() {
    const { annotations, data, deeplink, descendants, star } = this.props;
    const { expanded, focused } = this.state;

    const enumeration = data.get('enumeration', '0');
    const deeplinked = enumeration === deeplink;
    const starred = annotations.getIn([enumeration, 'starred'], false);
    const lead = enumeration === '0';
    const level = lead ? 1 : enumeration.split('.').length + 1;
    const heading = level > 6 ? 6 : level;
    const icons = lead ? ['book', 'book'] : ['bookmark', 'bookmark_border'];

    const groupkey = data.get('groupkey');
    let title = data.get('title');
    let key = <span key='groupkey'>{data.get('groupkey')}</span>;
    let body = <Html>{data.get('body', '')}</Html>;
    if (!data.has('title') && !groupkey) {
      [title, body] = this.shell;
      key = null;
    }

    const head = lead ? [key, title] : title;
    const slug = slugify(data.get('title', ''));
    const more = descendants.isEmpty() ? null : (
      <Button raised ripple onClick={this.expand}>
        Untergeordnete Normen anzeigen
      </Button>
    );

    return (
      <Card
        className={classNames(styles.norm, { focused, starred })}
        id={slug}
        shadow={focused ? 1 : undefined}
        onMouseEnter={() => this.focus(true)}
        onMouseLeave={() => this.focus(false)}
        onTouchStart={() => this.focus()}
      >
        <span ref={this.saveElemRef} />
        <CardTitle>
          {React.createElement(`h${heading}`, null, head)}
        </CardTitle>
        <CardMenu>
          <IconButton
            ripple
            colored={starred}
            name={starred ? icons[0] : icons[1]}
            onClick={() => star(data, !starred)}
            className={classNames({ visible: starred || focused })}
          />
          {deeplinked ? (
            <IconButton
              ripple disabled
              name={'center_focus_strong'}
              className='visible'
            />
          ) : (
            <Link
              to={getNormLink(groupkey, enumeration, title)}
              style={{ color: 'inherit' }}
            >
              <IconButton
                ripple name='center_focus_weak'
                className={classNames({ visible: focused })}
              />
            </Link>
          )}
        </CardMenu>
        <CardText>
          {body}
          <Html>{data.get('foot', '')}</Html>
          {!expanded ? more : (
            <Norms
              annotations={annotations}
              deeplink={deeplink}
              nodes={descendants}
              star={star}
            />
          )}
        </CardText>
      </Card>
    );
  }
}
