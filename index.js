const Micromachine = require('rfr')('lib/micromachine');

class HelloWorldService extends Micromachine.Service {

  execute(resolve, _reject) {
    resolve(`Running microservice using ${this.user_id}`);
  }
}

HelloWorldService.inputs = {
  required: ['user_id'],
  optional: ['service_id'],
};

let service = new HelloWorldService();
service.run({ user_id: 12, service_id: 15 })
  .then((data) => { console.log(data); })
  .catch((error) => { console.error(error); });

service = new HelloWorldService();
service.runtime = new Micromachine.HTTPEndpoint({
  port: 5000,
  path: '/hello',
});

service.run();
