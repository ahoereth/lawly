/* global require */
describe('redux', () => {
  // Look for `tests.js` files in direct child directories.
  const context = require.context('.', true, /.+\/.+\.test\.js?$/);
  context.keys().forEach(context);
});
