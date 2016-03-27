/* global require, module */

// Look for `tests.js` files in direct child directories.
var context = require.context('.', true, /.+\/tests\.js?$/);
context.keys().forEach(context);
module.exports = context;
