// const Runtime = require('rfr')('lib/runtimes/base');

// class AWSLambda extends Runtime.default {
class AWSLambda {

  start(service, parameters, callback = () => {}) {
    const promise = new Promise((resolve, reject) => {
      service.main(parameters.event, resolve, reject);
      callback();
    });
    return promise;
  }

}

export { AWSLambda as default };
