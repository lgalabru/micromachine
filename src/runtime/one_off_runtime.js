import { Runtime } from './runtime';

class OneOffRuntime /*extends Runtime*/ {

  constructor(inputs = {}) {
    // super();
    this.inputs = inputs;
  }

  register(service, callback) {
    this.service = service;
    return new Promise((resolve, reject) => {
      this.service.runOperation(this.inputs, callback, resolve, reject);
    });;
  }
}

export { OneOffRuntime as default };
