/* global require */
describe('components', () => {
  // Look for `*.test.js` files in the current and all child directories.
  var context = require.context('.', true, /.+\.test\.js?$/);
  context.keys().forEach(context);
});
