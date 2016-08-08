/* global require */
describe('helpers', () => {
  // Look for `*.test.js` files in the current and all child directories.
  const context = require.context('.', true, /.+\.test\.js?$/);
  context.keys().forEach(context);
});
