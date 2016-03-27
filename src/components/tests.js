/* global require */
describe('components', () => {
  var context = require.context('.', true, /.+\.test\.js?$/);
  context.keys().forEach(context);
});
