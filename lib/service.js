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
    let promise;
    if (this.runtime != null) {
      promise = this.runtime.start(this);
    } else {
      promise = new Promise((resolve, reject) => {
        this.main(inputs, resolve, reject);
      });
    }
    return promise;
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
      try {
        resolve(this.execute());
      } catch (e) {
        reject(e);
      }
    } else {
      errors.push(`Required inputs are missing: ${missingInputs}`);
      reject(errors);
    }
    return this;
  }

  execute() {
    console.log(`Excuting operation with parameters ${this}`);
  }
}

export { Service as default };
