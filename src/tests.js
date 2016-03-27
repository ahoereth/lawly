/* global require, module */
var context = require.context('.', true, /tests\.js?$/);
context.keys().forEach(context);
module.exports = context;
