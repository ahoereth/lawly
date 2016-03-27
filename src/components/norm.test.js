import chai from 'chai';
import spies from 'chai-spies';
const should = chai.should();
chai.use(spies);

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { shallowRender } from 'helpers/testUtils';
import { slugify } from 'helpers/utils';
import Norm from './Norm';


const normOptions = {
  props: {
    data: {
      enumeration: '1.1.4',
      title: 'Heading 3',
      groupkey: 'KEY_H3',
      // TODO: Use remarkable and markdown here?
      body: `
        <p>Some text.</p>
        <ul><li>With</li><li>a</li><li>list</li></ul>
      `,
      foot: `
        <ol><li>The</li><li>Footer</li></ol>
        <pre><code>With some preformatted text.</code></pre>
      `,
    },
  },
  patterns: {
    body: /.*?<p>.*?<\/p>\s*<ul>.*?<\/ul>.*?/,
    foot: /.*?<ol>.*?<\/ol>\s*<pre>.*?<\/pre>.*?/,
  },
};

const leadOptions = {
  props: {
    data: {
      enumeration: '0',
      title: 'Heading 1',
      groupkey: 'KEY_H1',
      body: '',
      foot: '',
    },
    star: chai.spy(() => {}),
    starred: true,
  },
  ref: {},
};


describe('Norm', () => {
  const norm = shallowRender(<Norm {...normOptions.props} />);

  it('renders a div with the correct class', () => {
    norm.type.should.equal('div');
    norm.props.should.have.a.property('className');
  });

  it('renders a correct heading', () => {
    const [ lead, head ] = norm.props.children;
    should.not.exist(lead);
    head.type.should.equal('h4');

    const { id, children: title } = head.props;
    id.should.equal(slugify(normOptions.props.data.title));
    title.should.equal(normOptions.props.data.title);
  });

  it('renders raw html in body and foot', () => {
    const [ , , body, foot ] = norm.props.children;
    body.type.should.equal('div');
    foot.type.should.equal('div');

    const renderedBody = renderToStaticMarkup(body);
    renderedBody.should.match(normOptions.patterns.body);
    renderedBody.match(/<\/li>/g).length.should.equal(3);

    const renderedFoot = renderToStaticMarkup(foot);
    renderedFoot.should.match(normOptions.patterns.foot);
    renderedFoot.match(/<\/li>/g).length.should.equal(2);
  });

  it('handles lead norm titles correctly', () => {
    const norm = shallowRender(<Norm {...leadOptions.props} />);
    const ref = leadOptions.props;
    const [ lead, title ] = norm.props.children;
    const [ toggle, groupkey ] = lead.props.children;

    title.type.should.equal('h1');
    title.props.children.should.equal(ref.data.title);
    title.props.id.should.equal(slugify(ref.data.title));
    groupkey.type.should.equal('span');
    groupkey.props.children.should.equal(ref.data.groupkey);

    toggle.type.name.should.equal('IconToggle');
    toggle.props.checked.should.equal(ref.starred);
    toggle.props.onChange();
    ref.star.should.be.spy;
    ref.star.should.have.been.called();
  });
});
