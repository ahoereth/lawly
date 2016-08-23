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

export default function getWorker() {
  const { Worker, __assets } = global.window || {};
  if (!isUndefined(Worker) && !isUndefined(__assets)) {
    const { js } = __assets['web-worker'];
    if (!isUndefined(js)) {
      return new global.window.Worker(js);
    }
  }

  return new WorkerMock();
}
