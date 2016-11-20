// Watch those:
// https://github.com/facebookincubator/create-react-app/blob/master/config/polyfills.js
// https://github.com/facebookincubator/create-react-app/issues/269

import assignPolyfill from 'object-assign';
import promisePolyfill from 'promise/lib/es6-extensions';
import promiseRejectionTracking from 'promise/lib/rejection-tracking';

Object.assign = assignPolyfill;

promiseRejectionTracking.enable();
window.Promise = promisePolyfill; /* global window */
