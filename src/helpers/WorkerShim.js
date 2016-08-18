import { isUndefined } from 'lodash';

// import LocalSearchWorker from './LocalSearchWorker';


class WorkerMock {
  constructor() {
    console.log('using workermock');
  }

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
    console.log('using worker');
    return new global.window.Worker(path);
  }

  console.log('using worker mock');
  return new WorkerMock(path);
}
