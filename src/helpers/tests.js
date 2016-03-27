/* global require */
describe('helpers', () => {
  var context = require.context('.', true, /.+\.test\.js?$/);
  context.keys().forEach(context);
});
