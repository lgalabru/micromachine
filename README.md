#### Installation

    npm install micromachine --save

#### Creating a new service

    import { Service } from 'micromachine';

    class SayHelloService extends Service {

      inputs() {
        super.inputs();
        super.required('firstname');
        super.optional('lastname')
      }

      // Implement your microservice using Single Responsability Principle
      execute(operation) {
        return { message: `Running microservice saying hello to ${operation.firstname}` };
      }
    }

#### Using this service synchronously

    SayHelloService.run({ firstname: 'Ludo' })

Cherry on top, the run method returns a Promise.

    SayHelloService.run({ firstname: 'Ludo' })
      .then((data) => { console.log(data); });
      .catch((error => { console.error(error); }));


#### Using this service as a RabbitMQ consumer

Visit https://github.com/lgalabru/micromachine-amqp
