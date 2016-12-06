class Service {

  constructor() {
    try {
      this.requiredInputs = this.constructor.inputs.required;
    } catch (e) {
      this.requiredInputs = [];
    }
    try {
      this.optionalInputs = this.constructor.inputs.optional;
    } catch (e) {
      this.optionalInputs = [];
    }
  }

  run(inputs = {}) {
    if (this.runtime == null) {
      return new Promise((resolve, reject) => {
        this.main(inputs, resolve, reject);
      });
    }
    this.runtime.start(this);
    return this;
  }

  main(inputs, resolve, reject) {
    const errors = [];
    const missingInputs = [];

    this.requiredInputs.forEach((key) => {
      if (inputs[key] == null) {
        missingInputs.push(key);
      } else {
        this[key] = inputs[key];
      }
    });
    if (missingInputs.length === 0) {
      this.optionalInputs.forEach((key) => {
        this[key] = inputs[key];
      });
      this.execute(resolve, reject);
    } else {
      errors.push(`Required inputs are missing: ${missingInputs}`);
      console.log(errors);
    }
    return this;
  }

  execute() {
    console.log(`Excuting operation with parameters ${this}`);
  }
}

// Operation.inputs = {
//   required: ['user_id'],
//   optional: ['service_id'],
// };

export { Service as default };
