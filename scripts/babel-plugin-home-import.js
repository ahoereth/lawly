/* eslint-disable import/no-commonjs */
const path = require('path');

/* global process */
const cwd = process.cwd();

module.exports = function () {
  return {
    visitor: {
      ImportDeclaration(target/* , state */) {
        const value = target.node.source.value;
        if (value.indexOf('~/') === 0) {
          // eslint-disable-next-line no-param-reassign
          target.node.source.value = path.join(cwd, 'src', value.slice(2));
        }
      },
    },
  };
};
