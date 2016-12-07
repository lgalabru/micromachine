const Hapi = require('hapi');

class HTTPMethod {

  toString() {
    return this.constructor.name;
  }
}

class GET extends HTTPMethod {

  static getInputs(request) {
    return request.query;
  }
}

class POST extends HTTPMethod {

  static getInputs(_request) {

  }
}

class DELETE extends POST {}
class PUT extends POST {}
class HEAD extends POST {}
class PATCH extends POST {}

class HTTPEndpoint {

  constructor(options = { port: 5000 }) {
    try {
      this.HTTPMethod = new options.HTTPMethod();
    } catch (e) {
      this.HTTPMethod = new GET();
    }
    try {
      this.path = options.path;
    } catch (e) {
      this.path = '/';
    }
    this.port = options.port;
  }

  stopServer() {
    this.server.stop(() => console.warn('shutdown successful'));
  }

  start(service, parameters, callback = () => {}) {
    this.configureServer((request, response) => {
      this.request = request;
      this.response = response;
      const inputs = this.HTTPMethod.constructor.getInputs(request);
      new Promise((resolve, reject) => { service.main(inputs, resolve, reject); })
        .then((data) => { response(this.completionHandler(data)); })
        .catch((error) => { response(this.errorHandler(error)); });
    });
    this.startServer(() => {
      console.log(`Booting microservice ${this.server.info.uri}${this.path}`);
      callback();
    });
    return this;
  }

  configureServer(handler) {
    this.server = new Hapi.Server();
    this.server.connection({ port: this.port });
    this.server.route({
      method: this.HTTPMethod.toString(),
      path: this.path,
      handler: (request, response) => {
        handler(request, response);
      },
    });

    function shutdown() {
      this.stopServer();
    }

    process
      .once('SIGINT', shutdown)
      .once('SIGTERM', shutdown);
  }

  startServer(callback = () => {}) {
    this.server.start(() => {
      this.uri = this.server.info.uri;
      callback();
    });
  }

  then(completionHandler) {
    this.completionHandler = completionHandler;
    return this;
  }

  catch(errorHandler) {
    this.errorHandler = errorHandler;
    return this;
  }

}

export { GET, POST, DELETE, PUT, HEAD, PATCH };
export { HTTPEndpoint as default };
