import LocalSearchWorker from './helpers/LocalSearchWorker';

/* global self */
const worker = self;

const search = new LocalSearchWorker();

worker.onmessage = function (e) {
  const { type, id, cmd, args } = e.data;

  // This receives messages in both directions -- ignore outgoing.
  if (type === 'response') {
    return;
  }

  // Currently all incoming messages are directed at the LocalSearchWorker.
  const val = search[cmd](...args);

  // If some id is given, a response is expected.
  if (id) {
    worker.postMessage({ type: 'response', cmd, id, val });
  }
};
