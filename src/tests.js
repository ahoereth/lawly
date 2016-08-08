/* global require */

// Look for `tests.js` files in direct child directories.
const context = require.context('.', true, /.+\/tests\.js?$/);
context.keys().forEach(context);
export default context;
