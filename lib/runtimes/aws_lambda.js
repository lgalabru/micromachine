// const Runtime = require('rfr')('lib/runtimes/base');

// class AWSLambda extends Runtime.default {
class AWSLambda {

  start(service, parameters, callback = () => {}) {
    service.main(parameters.event);
    callback();
  }

}

export { AWSLambda as default };
