const Hapi = require('hapi');
const Runtime = require('rfr')('lib/runtimes/base');

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

class HTTPEndpoint extends Runtime.default {

  constructor(options = { port: 5000 }) {
    super();
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
      service.main(inputs);
      response(this.render());
    });
    this.startServer(() => {
      console.log(`Booting microservice ${this.server.info.uri}${this.path}`);
      callback();
    });
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

  render() {
  }

}

export { GET, POST, DELETE, PUT, HEAD, PATCH };
export { HTTPEndpoint as default };
