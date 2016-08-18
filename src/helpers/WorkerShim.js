import { isUndefined } from 'lodash';

// TODO: Actually run local search when WebWorker is not available?
// import LocalSearchWorker from './LocalSearchWorker';


class WorkerMock {
  onmessage() {
    return;
  }

  postMessage(data) {
    this.onmessage({ data });
    return;
  }
}

export default function getWorker(path) {
  if (!isUndefined(global.window) && !isUndefined(global.window.Worker)) {
    return new global.window.Worker(path);
  }

  return new WorkerMock(path);
}
