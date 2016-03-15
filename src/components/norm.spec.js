import expect from 'expect';
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
  ref: {
    body: '<p>.*?<\/p>\\s*<ul>.*?<\/ul>',
    foot: '<ol>.*?<\/ol>\\s*<pre>.*?<\/pre>',
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
  },
  ref: {},
};


function rawHtmlRegExp(pattern) {
  return new RegExp(`<div>\\s*${pattern}\\s*<\/div>`, 'g');
}


describe('component', () => {
  describe('Norm', () => {
    const norm = shallowRender(<Norm {...normOptions.props} />);

    it('renders a div with the correct class', () => {
      expect(norm.type).toBe('div');
      expect(norm.props.className).toBe('norm');
    });

    it('renders a correct heading', () => {
      const heading = norm.props.children[0];
      const title = heading.props.children[0];
      expect(heading.type).toBe('h4');
      expect(title.props.id).toBe(slugify(normOptions.props.data.title));
      expect(title.props.children).toBe(normOptions.props.data.title);
    });

    it('renders raw html in body and foot', () => {
      const body = norm.props.children[1];
      const renderedBody = renderToStaticMarkup(body);
      expect(body.type).toBe('div');
      expect(renderedBody).toMatch(rawHtmlRegExp(normOptions.ref.body));
      expect(renderedBody.match(/<\/li>/g).length).toBe(3);

      const foot = norm.props.children[2];
      const renderedFoot = renderToStaticMarkup(foot);
      expect(foot.type).toBe('div');
      expect(renderedFoot).toMatch(rawHtmlRegExp(normOptions.ref.foot));
      expect(renderedFoot.match(/<\/li>/g).length).toBe(2);
    });

    it('handles lead norm titles correctly', () => {
      const lead = shallowRender(<Norm {...leadOptions.props} />);
      const ref = leadOptions.props.data;
      const [heading/*, body, foot*/] = lead.props.children;
      const [groupkey, title] = heading.props.children;

      expect(heading.type).toBe('h1');
      expect(groupkey.type).toBe('small');
      expect(groupkey.props.children.join('')).toBe(`(${ref.groupkey})`);
      expect(title.type).toBe('span');
      expect(title.props.id).toBe(slugify(ref.title));
      expect(title.props.children).toBe(ref.title);
    });
  });
});
