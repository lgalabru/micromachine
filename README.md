#### Installation

    npm install micromachine

#### Creating a new service

    class SayHelloService extends Micromachine.Service {
      
      // Implement your microservice using Single Responsability Principle
      execute() {
        if (false) {
          throw new Error('Something went wrong');
        }
        return { message: `Running microservice saying hello to ${this.firstname}` };
      }
    }

    SayHelloService.inputs = {
      required: ['first_name'],
      optional: ['last_name'],
    };


#### Using this service synchronously

    let service = new SayHelloService();
    service.run({ first_name: 'Ludo' })
      .then((data) => { console.log(data); });
      .catch((error => { console.error(error); }));

#### Using this service as a HTTP Endpoint

You can simply declare in your index.js

    let endpoint = new SayHelloService();
    endpoint.runtime = new Micromachine.HTTPEndpoint({
      port: 5000,
      path: '/hello',
    });

    endpoint.run()
      .then((data) => { console.log(data); });
      .catch((error => { console.error(error); }));

#### Using this service on AWS Lambda

You can simply declare in your index.js

    // index.js

    exports.handler = function(event, context) {
      let lambda = new SayHelloService();
      lambda.runtime = Micromachine.AWSLambda();

      lambda.run({ event: event, context: context })
	   .then((data) => { console.log(data); });
       .catch((error => { console.error(error); }));

	}
