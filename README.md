#### Installation

    npm install micromachine

#### Creating a new service

    class HelloWorldService extends Micromachine.Service {

      execute() {
        // Get your inputs
        console.log(this.user_id);

        // Implement your microservice using Single Responsability Principle
      }
    }

    HelloWorldService.inputs = {
      required: ['user_id'],
      optional: ['service_id'],
    };


#### Using this service synchronously

    let service = new HelloWorldService();
    service.run( {user_id: 3} );

#### Using this service as a HTTP Endpoint

You can simply declare in your index.js

    let endpoint = new HelloWorldService();
    endpoint.runtime = new Micromachine.HTTPEndpoint({
      port: 5000,
      path: '/hello',
      HTTPMethod: HTTPMethods.GET,
    });

    endpoint.run();

#### Using this service on AWS Lambda

You can simply declare in your index.js

    // index.js

    exports.handler = function(event, context) {
      let lambda = new HelloWorldService();
      lambda.runtime = Micromachine.AWSLambda();

      lambda.run({
	    event: event,
	    context: context,
	  });
	}
